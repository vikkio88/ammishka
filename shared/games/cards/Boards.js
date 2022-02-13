const Board = require('../Board');
const CARD_FACING = {
    UP: 'up',
    DOWN: 'down'
};
class PositionalBoard extends Board {
    constructor() {
        super();
        this.board = new Map();
        this.cards = [];
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

module.exports = {
    PositionalBoard,
    CARD_FACING
};