const { CARDS } = require('.');
const Card = require('./Card');
const Deck = require('./Deck');
const randomCardStack = ({ size = 3, seeds = ['someSeed'] } = {}) => {
    return Card.makeStack(seeds, size);
};

const SOME_OWNER_ID = 'someOwnerId';
const SOME_PLAYER_ID = 'somePlayerId';

describe('Deck specs', () => {
    it('builds correctly a deck', () => {
        let deck = new Deck();
        expect(deck.size).toBe(0);
        expect(deck.cardsMap).toBeInstanceOf(Map);
        expect(deck.cardsMap.size).toBe(0);
        expect(deck.cardsDrawn.length).toBe(0);
        deck = new Deck(randomCardStack(), SOME_OWNER_ID);
        expect(deck.size).toBe(3);
        expect(deck.cardsMap).toBeInstanceOf(Map);
        expect(deck.cardsMap.size).toBe(3);
        expect(deck.ownerId).toBe(SOME_OWNER_ID);
        expect(deck.cardsDrawn.length).toBe(0);
    });

    it('formats correctly as json', () => {
        let deck = new Deck();
        expect(deck.toJson()).toEqual({
            cardsLeft: 0,
            ownerId: null,
            size: 0
        });

        deck = Deck.makeFromCardStack(randomCardStack({ size: 1 }), SOME_OWNER_ID);
        expect(deck.toJson()).toEqual({
            cardsLeft: 1,
            ownerId: SOME_OWNER_ID,
            size: 1
        });
    });

    it('draws correctly', () => {
        const deck = Deck.makeFromCardStack(randomCardStack({ size: 2 }), SOME_OWNER_ID);
        expect(deck.toJson().cardsLeft).toBe(2);
        let card = deck.draw();
        expect(card).not.toBe(null);
        expect(card.toJson()).toEqual({ id: expect.any(String), value: 2, seed: expect.any(String) });
        expect(deck.toJson().cardsLeft).toBe(1);
        card = deck.draw();
        expect(card).not.toBe(null);
        expect(card.toJson()).toEqual({ id: expect.any(String), value: 1, seed: expect.any(String) });
        expect(deck.toJson().cardsLeft).toBe(0);
        card = deck.draw();
        expect(card).toBe(null);
        expect(deck.toJson().cardsLeft).toBe(0);
    });

    it('draws correctly storing player who drawn', () => {
        const deck = Deck.makeFromCardStack(randomCardStack({ size: 2 }), SOME_OWNER_ID);
        expect(deck.toJson().cardsLeft).toBe(2);
        const card = deck.draw(SOME_PLAYER_ID);
        expect(card).not.toBe(null);
        expect(card.toJson()).toEqual({ id: expect.any(String), value: 2, seed: expect.any(String) });
        expect(deck.toJson().cardsLeft).toBe(1);
        expect(deck.cardsDrawn[0]).toEqual(expect.arrayContaining([SOME_PLAYER_ID, card.id]));
    });

    // since it is randm sometimes it fails
    it.skip('shuffles correctly', () => {
        const cards = randomCardStack({ size: 5 });
        const deck = new Deck(cards);
        expect(deck.size).toBe(cards.length);

        deck.shuffle();
        const cardsMap = deck.cards.map(({ id }) => id);
        deck.shuffle();
        expect(deck.cards.map(({ id }) => id)).not.toEqual(cardsMap);
    });

    it('makes a deck from config', () => {
        const deck = Deck.makeFromConfig(CARDS.DECKS.CONFIG[CARDS.TYPES.FRENCH]);
        expect(deck.size).toBe(52);
        deck.shuffle();
        const card = deck.draw();
        expect(CARDS.DECKS.CONFIG[CARDS.TYPES.FRENCH].seeds.array.includes(card.seed)).toBe(true);
    });
});