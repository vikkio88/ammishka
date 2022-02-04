const Card = require('./Card');

class Deck {
    constructor(
        /** @type ?Cards[] */
        cards = null,
        ownerId = null
    ) {
        this.ownerId = ownerId;

        /** @type Card[] */
        this.cards = cards || [];
        this.cardsMap = new Map();
        for (const card of this.cards) {
            this.cardsMap.set(card.id, card);
        }
        this.size = this.cards.length;
        this.cardsDrawn = [];
    }

    cardsLeft() {
        return this.cards.length;
    }

    draw(playerId = null) {
        if (!Boolean(this.cardsLeft())) {
            return null;
        }

        const card = this.cards.pop();
        this.cardsDrawn.push(
            Boolean(playerId) ? [playerId, card.id] : card.id
        );

        return card;
    }

    toJson() {
        return {
            size: this.size,
            cardsLeft: this.cardsLeft(),
            ownerId: this.ownerId,
        };
    }

    shuffle() {
        this.cards.sort(() => Math.random() - .5);
    }

    static makeFromCardStack(
        /** @type ?Card[] */
        cardStack,
        ownerId = null
    ) {
        return new Deck(cardStack, ownerId);

    }

    static makeFromConfig(deckConfig = {}) {
        if (!Boolean(deckConfig?.seeds?.array) || !Boolean(deckConfig?.size?.perSeed)) {
            throw Error('Invalid Deck Configuration', deckConfig);
        }
        const cards = Card.makeStack(deckConfig.seeds.array, deckConfig.size.perSeed);
        return new Deck(cards);
    }
}
module.exports = Deck;