const Board = require('../Board');
const Card = require('./Card');
const CARD_FACING = {
    UP: 'up',
    DOWN: 'down'
};

const PILES = {
    COMMON_DISCARD: 'common_discard_pile',
    DISCARD: 'discard_pile',
    PLAYERS: 'players_piles',
    PLAYER: 'player_piles',
};

// Does not handle duplicates
class PositionalBoard extends Board {
    constructor(players = []) {
        super();
        this.board = new Map();
        this.cards = [];

        this.piles = {
            [PILES.COMMON_DISCARD]: [],
        };

        if (players.length > 0) this.piles[PILES.PLAYERS] = {};

        for (const player of players) {
            this.piles[PILES.PLAYERS][player.id] = {
                [PILES.PLAYER]: [],
                [PILES.DISCARD]: [],
            };
        }

    }

    discard(card, playerId = null) {
        // this is crap but is ok
        card = Card.fromJson(card);
        if (playerId) {
            this.addToPlayerPile(playerId, card, PILES.DISCARD);
            return;
        }

        this.addToPile(PILES.COMMON_DISCARD, card);
    }

    addToPile(pile, card) {
        // this is crap but is ok
        card = Card.fromJson(card);
        this.piles[pile].push(card);
    }

    addToPlayerPile(playerId, card, pile = PILES.PLAYER) {
        // this is crap but is ok
        card = Card.fromJson(card);
        this.piles[PILES.PLAYERS][playerId][pile].push(card);
    }

    place(card, playerId, position = [0, 0], facing = CARD_FACING.UP) {
        // need to handle duplicates if double decks too
        // if this.has card then change id adding player or maybe a random id
        // TODO
        this.board.set(card.id, { card, playerId, facing, position });
        this.cards.push(card.id);
    }

    has(cardId) {
        return this.board.has(cardId);
    }

    hasIndex(cardIndex) {
        return Boolean(this.cards[cardIndex]);
    }

    // a player can peek only his own card
    peek(playerId, index) {
        const cardId = this.cards[index];
        if (this.has(cardId) && this.board.get(cardId).playerId === playerId) {
            return this.board.get(cardId).card.toJson();
        }

        return null;

    }

    // a player can peek only his own card
    flip(playerId, index) {
        const cardId = this.cards[index];
        if (this.has(cardId) && this.board.get(cardId).playerId === playerId) {
            const cc = this.board.get(cardId);
            const newFacing = cc.facing === CARD_FACING.UP ? CARD_FACING.DOWN : CARD_FACING.UP;
            cc.facing = newFacing;


            return true;
        }

        return false;
    }

    take(cardIndex, flip = true) {
        if (!this.hasIndex(cardIndex)) return false;

        const cardId = this.cards[cardIndex];
        const cc = this.board.get(cardId);
        this.cards = this.cards.filter(id => id !== cardId);

        // think about doing a TAKE but with flipped card, maybe add to pile 
        return flip ? cc.card.toJson() : null;
    }

    cleanUp() {
        return [];
    }

    pilesToJson() {
        const piles = { [PILES.COMMON_DISCARD]: this.piles[PILES.COMMON_DISCARD].map(c => c.toJson()) };

        if (Boolean(this.piles[PILES.PLAYERS])) {
            piles[PILES.PLAYERS] = {};
            for (const playerId of Object.keys(this.piles[PILES.PLAYERS])) {
                piles[PILES.PLAYERS][playerId] = {
                    [PILES.PLAYER]: this.piles[PILES.PLAYERS][playerId][PILES.PLAYER].map(c => c.toJson()),
                    [PILES.DISCARD]: this.piles[PILES.PLAYERS][playerId][PILES.DISCARD].map(c => c.toJson()),
                };

            }
        }
        return piles;
    }

    boardCardsToJson() {
        const cards = [];
        for (const id of this.cards) {
            const { playerId, facing, position, card } = this.board.get(id);
            cards.push({
                card: facing === CARD_FACING.UP ? card.toJson() : null,
                ownerId: playerId,
                position, facing
            });
        }

        return cards;
    }



    toJson() {
        const cards = this.boardCardsToJson();
        const piles = this.pilesToJson();
        return {
            cards,
            piles
        };
    }
}


const defaultSlotsConfiguration = {
    slots: () => new Slot()
};

class Slot {
    constructor(name, ownerId = null) {
        this.name = name;
        this.ownerId = ownerId;
        this.stack = [];
        this.cards = [];
    }

    place(card, facing) {
        this.cards.push(card.id);
        this.stack.push({ card, facing });
    }

    remove(howMany = 1) {
        const removed = [];
        for (let i = 0; i < howMany; i++) {
            removed.push(this.stack.pop());
        }

        const removedIds = removed.map(({ id }) => id);
        this.cards = this.cards.filter(id => !removedIds.includes(id));

        return removedIds;
    }
}

// maybe wont need this ↑ and I could collapse it into this ↓
class SlotsBoard extends PositionalBoard {
    constructor(config = {}) {
        super();
        config = { ...defaultSlotsConfiguration, ...config };
        this.slots = config.slots();
        this.cards = [];
    }

    place(card, playerId, slot, facing = CARD_FACING.UP) {
        // need to handle duplicates if double decks too
        // if this.has card then change id adding player or maybe a random id
        // TODO
        this.slots.place(slot, { card, playerId, facing, slot });
        this.cards.push(card.id);
    }

    toJson() {
        const board = super.toJson();
        return {
            ...board,
            slots: this.slots
        };
    }
}

module.exports = {
    PositionalBoard,
    SlotsBoard,
    CARD_FACING,
    PILES
};