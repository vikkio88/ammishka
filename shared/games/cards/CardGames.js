const { actionResult: a_r } = require('../../payloads');

const Game = require('../Game');
const Deck = require('./Deck');

const defaultConfig = { minPlayers: 2, maxPlayers: 2 };

const CARD_GAME_ACTIONS = {
    DRAW: 'draw',
    PLAY_CARD: 'play_card',
    SHOW_HAND: 'show_hand',
};

const CARD_GAME_ACTIONS_CONDITIONS = {
    [CARD_GAME_ACTIONS.DRAW]: ({ turns, playerId, hands }) => turns.order[0] === playerId,
    [CARD_GAME_ACTIONS.PLAY_CARD]: ({ turns, playerId, hands, payload: { cardId } }) => turns.order[0] === playerId && hands.has(playerId) && hands.get(playerId).has(cardId),
    [CARD_GAME_ACTIONS.SHOW_HAND]: ({ hands, playerId }) => hands.has(playerId),
};

const CARD_GAME_ACTIONS_EFFECTS = {
    [CARD_GAME_ACTIONS.DRAW]: () => ({}),
    [CARD_GAME_ACTIONS.PLAY_CARD]: () => ({ endTurn: true }),
    [CARD_GAME_ACTIONS.SHOW_HAND]: () => { },
};



class SingleDeckCardGame extends Game {
    constructor(
        /** @type Deck */
        deck,
        players = [],
        config = {}
    ) {
        super();

        this.deck = deck;
        this.players = players;
        this.config = { ...defaultConfig, ...config };

        if (players.length < 1) throw Error('Not Enough players');

        const order = players.map(({ id }) => id);

        this.hands = new Map();

        order.forEach(pId => this.hands.set(pId, new Map()));

        this.turns = {
            currentTurn: [],
            log: [],
            order,
            baseOrder: order,
            turn: 0,
        };
    }

    checkTurn(playerId) {
        return this.turns.order[0] === playerId;
    }

    action(playerId, type, payload = {}) {
        if (!this.isReady()) return a_r(
            false,
            { reason: `Game is not Ready: ${type} , ${playerId}` }
        );

        if (!Object.values(CARD_GAME_ACTIONS).includes(type)) {
            console.error(`Not an existing action ${type} , ${playerId}`);
            return a_r(false, { reason: `Not an existing action ${type} , ${playerId}` });
        }


        if (!CARD_GAME_ACTIONS_CONDITIONS[type]({
            turns: this.turns,
            hands: this.hands,
            playerId,
            payload, // this will have things like cardId
        })
        ) {
            console.error(`Not a valid action (condition failed) ${type}: , ${playerId}`);
            return a_r(false, { reason: `Not a valid action (condition failed) ${type}: , ${playerId}` });
        }

        let result = null;
        // make action
        switch (type) {
            case CARD_GAME_ACTIONS.DRAW: {
                const card = this.deck.draw();
                const hand = this.hands.get(playerId);
                hand.set(card.id, card);
                result = a_r(true, { hand: [...hand].map(cs => cs[1].toJson()) });
                break;
            }
            case CARD_GAME_ACTIONS.SHOW_HAND: {
                const hand = this.hands.get(playerId);
                result = a_r(true, { hand: [...hand] });
                break;
            }
            case CARD_GAME_ACTIONS.PLAY_CARD: {
                const hand = this.hands.get(playerId);
                // atm just deleting the card
                hand.delete(payload.cardId);
                result = a_r(true, { hand: [...hand] });
                break;
            }
            default: {
                result = a_r(false, { reason: 'This should never happen' });
            }
        }



        const { endTurn = false } = CARD_GAME_ACTIONS_EFFECTS[type];
        //if action happened successfully && endTurn
        if (endTurn) {
            this.turns.order.shift();
            if (this.turns.order.length === 0) {
                this.turns.turn += 1;
                this.currentTurn = [];
            }
        }

        return result;
    }

    hasStarted() {
        return this.turns.turn > 0;
    }

    isReady() {
        const cPlayers = this.players.length;
        const { minPlayers, maxPlayers } = this.config;
        return cPlayers >= minPlayers && cPlayers <= maxPlayers;
    }

    toJson() {
        return {
            deck: this.deck.toJson(),
            turns: { ...this.turns },
            hasStarted: this.hasStarted(),
            isReady: this.isReady(),
        };
    }
}

module.exports = {
    SingleDeckCardGame,
    CARD_GAME_ACTIONS
};