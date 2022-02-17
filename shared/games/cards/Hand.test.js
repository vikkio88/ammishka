const Hand = require('./Hand');
const Card = require('./Card');

getCard = ({ value = 1, seed = 'something' } = {}) => new Card(value, seed);
describe('Card specs', () => {

    it('builds correctly a Hand', () => {
        const hand = new Hand(null, [getCard()]);
        expect(hand.toJson()).toEqual({
            ownerId: null,
            cards: [{
                id: 'something_1',
                value: 1,
                seed: 'something'
            }]
        });
    });

    it('adds a card', () => {
        const hand = new Hand();
        expect(hand.toJson()).toEqual({
            ownerId: null,
            cards: []
        });
        const card = getCard();
        hand.add(card);
        expect(hand.toJson()).toEqual({
            ownerId: null,
            cards: [{ ...card.toJson() }]
        });
        hand.get(card.id);
        expect(hand.toJson()).toEqual({
            ownerId: null,
            cards: []
        });

        const cardJs = card.toJson();
        hand.add(cardJs);
        expect(hand.toJson()).toEqual({
            ownerId: null,
            cards: [{ ...card.toJson() }]
        });
    });

    // todo
    // it handles duplicates cards

});