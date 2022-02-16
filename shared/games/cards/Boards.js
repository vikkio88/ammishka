const Board = require('../Board');
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
class PositionalBoard extends Board {
    constructor(players = []) {
        super();
        this.board = new Map();
        this.cards = [];
        this.piles = {
            [PILES.COMMON_DISCARD]: [],
            [PILES.PLAYERS]: players.map(({id})=> ({
                [PILES.PLAYER]:[], 
                [PILES.DISCARD]: []
            })),
        };
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

    take(cardId) {
        const index = this.board.get(cardId);

    }

    toJson() {
        const cards = [];
        for (const id of this.cards) {
            const { playerId, facing, position, card } = this.board.get(id);
            cards.push({
                card: facing === CARD_FACING.UP ? card.toJson() : null,
                ownerId: playerId,
                position, facing
            });
        }
        return {
            cards,
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
    CARD_FACING
};