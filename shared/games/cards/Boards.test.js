const Board = require('../Board');
const { PositionalBoard, CARD_FACING } = require('./Boards');
const Card = require('./Card');
const SOME_PLAYER_ID = 'somePlayerId';

describe('Board specs', () => {
    it('build a board correctly', () => {
        const b = new Board();

        expect(b.toJson()).toEqual({});
    });
    describe('Positional Board specs', () => {
        it('allows you to place cards in positions', () => {
            const b = new PositionalBoard();
            const card = new Card(1, 'banane');

            b.place(card, SOME_PLAYER_ID, [0, 0]);

            expect(b.toJson()).toEqual({
                cards: [
                    {
                        card: { ...card.toJson(), },
                        ownerId: SOME_PLAYER_ID,
                        facing: 'up',
                        position: [0, 0]
                    }
                ]
            });

            const anotherCard = new Card(10, 'somethingelse');
            b.place(anotherCard, SOME_PLAYER_ID, [10, 3], CARD_FACING.DOWN);

            expect(b.toJson()).toEqual({
                cards: [
                    {
                        card: { ...card.toJson(), },
                        ownerId: SOME_PLAYER_ID,
                        facing: 'up',
                        position: [0, 0]
                    },
                    {
                        card: null,
                        ownerId: SOME_PLAYER_ID,
                        facing: 'down',
                        position: [10, 3]
                    }
                ]
            });

            expect(b.has(card.id)).toBe(true);
            expect(b.has(anotherCard.id)).toBe(true);
            expect(b.has('blueeyedwhitedragon')).toBe(false);

        });

        it('allows peek if player placed the card', () => {
            const b = new PositionalBoard();
            const card = new Card(1, 'yogurt');

            b.place(card, SOME_PLAYER_ID, [0, 0]);
            expect(b.has(card.id)).toBe(true);

            let result = b.peek(SOME_PLAYER_ID, 0);
            expect(result).toEqual({
                ...card.toJson()
            });

            result = b.peek(SOME_PLAYER_ID, 10);
            expect(result).toBe(null);

            result = b.peek('someOtherDude', 0);
            expect(result).toBe(null);
        });

        it('allows flip if player placed the card', () => {
            const b = new PositionalBoard();
            const card = new Card(1, 'yogurt');

            b.place(card, SOME_PLAYER_ID, [0, 0], CARD_FACING.DOWN);
            expect(b.has(card.id)).toBe(true);
            expect(b.toJson().cards[0]).toEqual(
                expect.objectContaining({
                    facing: 'down'
                })
            );

            let result = b.flip(SOME_PLAYER_ID, 10);
            expect(result).toBe(false);
            result = b.flip('someOtherDude', 0);
            expect(result).toBe(false);

            result = b.flip(SOME_PLAYER_ID, 0);
            expect(result).toBe(true);

            expect(b.toJson().cards[0]).toEqual(
                expect.objectContaining({
                    facing: 'up'
                })
            );
        });

    });
});