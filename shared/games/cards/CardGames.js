const { actionResult: a_r } = require('../../payloads');

const Game = require('../Game');
const Deck = require('./Deck');
const Hand = require('./Hand');
const Phases = require('./Phases');


const ACTIONS = {
    DRAW: 'draw',
    PLAY_CARD: 'play_card',
    LOOK_AT_OWN_HAND: 'look_at_own_hand',
    SHOW_HAND: 'show_hand',
    END_PHASE: 'end_phase',
    END_TURN: 'end_phase',
};

const ACTIONS_CONDITIONS = {
    [ACTIONS.DRAW]: ({ turns, playerId, hands }) => turns.order[0] === playerId,
    [ACTIONS.PLAY_CARD]: ({ turns, playerId, hands, payload: { cardId } }) => turns.order[0] === playerId && hands.has(playerId) && hands.get(playerId).has(cardId),
    [ACTIONS.LOOK_AT_OWN_HAND]: ({ hands, playerId }) => hands.has(playerId),
    [ACTIONS.END_PHASE]: ({ turns, playerId }) => turns.order[0] === playerId,
};

const ACTIONS_EFFECTS = {
    [ACTIONS.DRAW]: () => ({ endPhase: true }),
    [ACTIONS.PLAY_CARD]: () => ({ endPhase: true }),
    default: () => ({}),
};

const PHASES = {
    DRAW: 'draw_phase',
    PLAY: 'play_phase'
};

const PHASES_ACTIONS = {
    [PHASES.DRAW]: [ACTIONS.DRAW],
    [PHASES.PLAY]: [ACTIONS.PLAY_CARD],
};


const defaultConfig = {
    minPlayers: 2, maxPlayers: 2,
    phases: [PHASES.DRAW, PHASES.PLAY],
    phasesActions: PHASES_ACTIONS,
    indipendentActions: [ACTIONS.LOOK_AT_OWN_HAND, ACTIONS.SHOW_HAND],
    initialSetup: ({ deck, players, hands, order }) => ({ deck, players, hands, order }),
};



class SingleDeckCardGame extends Game {
    constructor(
        /** @type Deck */
        startingDeck,
        playersInOrder = [],
        config = {}
    ) {
        super();

        this.deck = startingDeck;
        if (playersInOrder.length < 1) throw Error('Not Enough players');
        this.players = playersInOrder;
        this.config = { ...defaultConfig, ...config };


        const baseOrder = this.players.map(({ id }) => id);

        this.hands = new Map();
        this.phases = new Phases(
            this.config.phases,
            this.config.phasesActions
        );

        baseOrder.forEach(pId => this.hands.set(pId, new Hand(pId)));
        this.turns = {
            currentPhase: this.phases.current(),
            currentTurn: [],
            log: [],
            order: baseOrder,
            baseOrder: [...baseOrder],
            turn: 0,
        };
        const { deck, players, hands, order } = this.config.initialSetup({
            deck: this.deck,
            players: this.players,
            hands: this.hands,
            order: this.turns.baseOrder,
        });

        this.deck = deck;
        this.players = players;
        this.hands = hands;
        this.order = order;

    }

    checkTurn(playerId) {
        return this.turns.order[0] === playerId;
    }

    action(playerId, type, payload = {}) {
        if (!this.isReady()) {
            console.error(`${playerId}: tried action ${type}, while game was not ready`);
            return a_r(
                false,
                { reason: `Game is not Ready: ${type} , ${playerId}` }
            );
        }

        if (!Object.values(ACTIONS).includes(type)) {
            console.error(`${playerId}: tried not an existing action ${type}`);
            return a_r(false, { reason: `Not an existing action ${type}` });
        }

        // check if action is compatible with phase
        if (
            // some actions can be done regardless of the phase
            !this.config.indipendentActions.includes(type) &&
            !this.phases.canDo(type)) {
            console.error(`${playerId}: tried ${type} on phase ${this.phases.current()}`);
            return a_r(false, { reason: `Cannot do ${type} on ${this.phases.current()} , ${playerId}` });
        }


        if (!ACTIONS_CONDITIONS[type]({
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
        // if result false report

        // make action
        switch (type) {
            case ACTIONS.DRAW: {
                const card = this.deck.draw();
                const hand = this.hands.get(playerId);
                hand.add(card);
                result = a_r(true, { hand: hand.toJson(), drawnCard: card.toJson() });
                break;
            }
            case ACTIONS.LOOK_AT_OWN_HAND: {
                const hand = this.hands.get(playerId);
                result = a_r(true, { hand: hand.toJson() });
                break;
            }
            case ACTIONS.END_PHASE: {
                result = a_r(true, { phases: { current: this.phases.current(), next: this.phases.next() } });
                break;
            }
            case ACTIONS.PLAY_CARD: {
                // maybe check if player has card
                const hand = this.hands.get(playerId);

                const card = hand.get(payload.cardId);
                // here you play the card

                result = a_r(true, {
                    playedCard: card.toJson(),
                    hand: hand.toJson()
                });
                break;
            }
            default: {
                result = a_r(false, { reason: 'This should never happen' });
                break;
            }
        }



        this.turns.currentTurn.push([playerId, { type, payload }]);

        const { endPhase = false } = (ACTIONS_EFFECTS[type] || ACTIONS_EFFECTS.default)();
        let endTurn = false;
        if (endPhase) {
            const endPhaseResult = this.phases.end();
            endTurn = endPhaseResult.endTurn;
        }
        //if action happened successfully && endTurn
        if (endTurn) {
            this.phases.reset();
            this.turns.order.shift();
            if (this.turns.order.length === 0) {
                this.turns.turn += 1;
                this.turns.log.push(this.turns.currentTurn);
                this.turns.currentTurn = [];
                this.turns.order = this.turns.baseOrder;
            }
        }

        // here might want to broadcast new game state
        this.getServer().gameStateUpdate(this.toJson());
        this.getServer().reportResult(result);
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

    // might move turns to 
    // its own class
    turnsToJson() {
        return {
            ...this.turns,
            currentPhase: this.phases.current(),
        };
    }

    toJson() {
        return {
            phase: this.phases.toJson(),
            deck: this.deck.toJson(),
            turns: this.turnsToJson(),
            hasStarted: this.hasStarted(),
            isReady: this.isReady(),
        };
    }
}

module.exports = {
    SingleDeckCardGame,
    CARD_GAME_ACTIONS: ACTIONS
};