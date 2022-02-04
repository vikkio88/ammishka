const Game = require('../Game');
const Deck = require('./Deck');

const defaultConfig = { minPlayers: 2, maxPlayers: 2 };

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
        // those need to map to an error with a_r
        if (!this.isReady()) return false;
        if (!this.checkTurn(playerId)) return false;

        

        //if action happened successfully
        this.turns.order.shift();

        if (this.turns.order.length === 0) {

            this.turns.turn += 1;
            this.currentTurn = [];
        }
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
    SingleDeckCardGame
};