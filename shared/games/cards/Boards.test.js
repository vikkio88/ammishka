const Board = require('../Board');
const { PositionalBoard, CARD_FACING, PILES } = require('./Boards');
const Card = require('./Card');
const Deck = require('./Deck');
const Hand = require('./Hand');
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
                ],
                piles: { [PILES.COMMON_DISCARD]: [] }
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
                ],
                piles: { [PILES.COMMON_DISCARD]: [] }
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

            result = b.flip(SOME_PLAYER_ID, 0);
            expect(result).toBe(true);

            expect(b.toJson().cards[0]).toEqual(
                expect.objectContaining({
                    facing: 'down'
                })
            );
        });

        it('allows taking a card', () => {
            const b = new PositionalBoard();
            const card = new Card(1, 'yogurt');
            const card2 = new Card(3, 'yogurt');

            b.place(card, SOME_PLAYER_ID, [0, 0], CARD_FACING.DOWN);
            b.place(card2, SOME_PLAYER_ID, [0, 3], CARD_FACING.DOWN);

            let result = b.take(2);
            expect(result).toBe(false);

            result = b.take(0);
            expect(result).toEqual({
                ...card.toJson()
            });
            expect(b.toJson().cards).not.toEqual([]);

            result = b.take(0);
            expect(result).toEqual({
                ...card2.toJson()
            });
            expect(b.toJson().cards).toEqual([]);
        });

        it('manages moving from piles', () => {
            const b = new PositionalBoard([{ id: SOME_PLAYER_ID }]);
            const card = new Card(1, 'yogurt');
            const card2 = new Card(3, 'yogurt');

            b.place(card, SOME_PLAYER_ID, [0, 0], CARD_FACING.UP);
            b.place(card2, SOME_PLAYER_ID, [0, 3], CARD_FACING.DOWN);
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
                        position: [0, 3]
                    },

                ],
                piles: {
                    [PILES.COMMON_DISCARD]: [],
                    [PILES.PLAYERS]: {
                        [SOME_PLAYER_ID]: {
                            [PILES.PLAYER]: [],
                            [PILES.DISCARD]: [],
                        }
                    }
                }
            });
            const c = b.take(0);
            b.discard(c);
            expect(b.toJson()).toEqual({
                cards: [
                    {
                        card: null,
                        ownerId: SOME_PLAYER_ID,
                        facing: 'down',
                        position: [0, 3]
                    },

                ],
                piles: {
                    [PILES.COMMON_DISCARD]: [
                        { ...c }
                    ],
                    [PILES.PLAYERS]: {
                        [SOME_PLAYER_ID]: {
                            [PILES.PLAYER]: [],
                            [PILES.DISCARD]: [],
                        }
                    }
                }
            });
            const c1 = b.take(0);
            b.discard(c1, SOME_PLAYER_ID);
            expect(b.toJson()).toEqual({
                cards: [],
                piles: {
                    [PILES.COMMON_DISCARD]: [
                        { ...c }
                    ],
                    [PILES.PLAYERS]: {
                        [SOME_PLAYER_ID]: {
                            [PILES.PLAYER]: [],
                            [PILES.DISCARD]: [{ ...c1 }],
                        }
                    }
                }
            });

            const directCard = new Card(8, 'fruit');

            b.addToPlayerPile(SOME_PLAYER_ID, directCard);
            expect(b.toJson()).toEqual({
                cards: [],
                piles: {
                    [PILES.COMMON_DISCARD]: [
                        { ...c }
                    ],
                    [PILES.PLAYERS]: {
                        [SOME_PLAYER_ID]: {
                            [PILES.PLAYER]: [{ ...directCard }],
                            [PILES.DISCARD]: [{ ...c1 }],
                        }
                    }
                }
            });
        });


        it('can return everything to the deck', () => {
            const stack = Card.makeStack(['a', 'b'], [1, 2]);
            const initialDeck = Deck.makeFromCardStack(stack);
            const initialDeckState = { ...initialDeck.toJson() };
            const hand = new Hand(SOME_PLAYER_ID);
            const b = new PositionalBoard([{ id: SOME_PLAYER_ID }]);
            const initialBoardState = { ...b.toJson() };

            hand.add(initialDeck.draw());
            hand.add(initialDeck.draw());
            hand.add(initialDeck.draw());
            hand.add(initialDeck.draw());

            expect(initialDeck.cardsLeft()).toBe(0);

            expect(hand.toJson()).toEqual({
                ownerId: SOME_PLAYER_ID,
                cards: [
                    {
                        id: 'b_2',
                        seed: 'b',
                        value: 2,
                    },
                    {
                        id: 'b_1',
                        seed: 'b',
                        value: 1,
                    },
                    {
                        id: 'a_2',
                        seed: 'a',
                        value: 2,
                    },
                    {
                        id: 'a_1',
                        seed: 'a',
                        value: 1,
                    },
                ]
            });


            let card = hand.get('b_2');
            b.place(card, SOME_PLAYER_ID, [0, 0]);
            card = hand.get('b_1');
            b.discard(card);
            card = hand.get('a_1');
            b.discard(card, SOME_PLAYER_ID);
            card = hand.get('a_2');
            b.addToPlayerPile(SOME_PLAYER_ID, card);

            const finalBoardState = { ...b.toJson() };

            expect(finalBoardState).toEqual({
                cards: [{
                    facing: 'up',
                    position: [0, 0],
                    ownerId: SOME_PLAYER_ID,
                    card: {
                        id: 'b_2',
                        seed: 'b',
                        value: 2,
                    }
                }
                ],
                piles: {
                    [PILES.COMMON_DISCARD]: [
                        {
                            id: 'b_1',
                            seed: 'b',
                            value: 1,
                        }
                    ],
                    [PILES.PLAYERS]: {
                        [SOME_PLAYER_ID]: {
                            [PILES.PLAYER]: [
                                {
                                    id: 'a_2',
                                    seed: 'a',
                                    value: 2,
                                }
                            ],
                            [PILES.DISCARD]: [
                                {
                                    id: 'a_1',
                                    seed: 'a',
                                    value: 1,
                                }
                            ],
                        }
                    }
                }
            });


            // Return to deck here
            // piles used for score
            const { piles, cards: cardStack } = b.cleanUp();

            expect(piles).toEqual(finalBoardState.piles);
            expect(b.toJson()).toEqual(initialBoardState);

            const finalDeck = Deck.makeFromCardStack(cardStack);
            expect(finalDeck.toJson()).toEqual(initialDeckState);
        });

    });
});