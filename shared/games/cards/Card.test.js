const Card = require('./Card');
describe('Card specs', () => {

    it('builds correctly a card', () => {
        const card = new Card(10, 'something');
        expect(card.value).toBe(10);
        expect(card.seed).toBe('something');
    });

    it('builds correctly a card from a serialised one', () => {
        const card = new Card(10, 'something');
        const cs = card.toJson();
        const other = Card.fromJson(cs);

        expect(other.toJson()).toEqual({ ...cs });
        expect(other.toJson()).toEqual({ ...card.toJson() });

        // those are the same object in case cardJs is
        // already instance of card
        const newCard = Card.fromJson(card);
        expect(newCard).toBe(card);
    });


    it('gives a simple id if not specified', () => {
        const card = new Card(10, 'something');
        expect(card.id).toBe('something_10');
    });

    it('creates a card stack correctly', () => {
        let cards = Card.makeStack(['a', 'b'], [1, 5]);
        expect(cards.length).toBe(10);
        cards = Card.makeStack(['a', 'b'], 10);
        expect(cards.length).toBe(20);
    });

});