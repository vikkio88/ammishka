const Card = require('./Card');

const defaultConfig = { minCards: 0, maxCards: 3 };

// does not handle well duplicates cards
class Hand {
    constructor(
        ownerId = null,
        /** @type ?Card[] */
        cards = [],
        config = {}
    ) {
        this.ownerId = ownerId;
        this.cardsMap = new Map();
        for (const card of cards) {
            this.cardsMap.set(card.id, card);
        }

        this.config = { ...defaultConfig, ...config };
    }

    add(card) {
        // make sure you check if sometimes you
        // have duplicates
        card = card instanceof Card ? card : Card.fromJson(card);
        this.cardsMap.set(card.id, card);
    }

    get(cardId) {
        if (!this.has(cardId)) return null;

        const card = this.cardsMap.get(cardId);
        this.cardsMap.delete(cardId);
        return card;
    }

    has(cardId) {
        return this.cardsMap.has(cardId);
    }


    toJson() {
        return {
            ownerId: this.ownerId,
            cards: [...this.cardsMap].map(cs => cs[1].toJson())
        };
    }


}
module.exports = Hand;