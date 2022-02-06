const { CARDS } = require('.');
const { SingleDeckCardGame, CARD_GAME_ACTIONS } = require('./CardGames');
const Deck = require('./Deck');

const PLAYER_ONE = 'idPlayer1';
const PLAYER_TWO = 'idPlayer2';
const PLAYERS = [{ id: PLAYER_ONE }, { id: PLAYER_TWO }];

describe('SingleDeckCardGame specs', () => {
    it('builds the game correctly', () => {
        const deck = Deck.makeFromConfig(CARDS.DECKS.CONFIG[CARDS.TYPES.FRENCH]);
        let g = new SingleDeckCardGame(deck, PLAYERS);

        expect(g.toJson()).toEqual({
            deck: {
                ...deck.toJson(),
            },
            hasStarted: false,
            isReady: true,
            turns: {
                currentPhase: 'draw_phase',
                currentTurn: [],
                order: [PLAYER_ONE, PLAYER_TWO],
                baseOrder: [PLAYER_ONE, PLAYER_TWO],
                turn: 0,
                log: [],
            }
        });

        g = new SingleDeckCardGame(deck, [PLAYERS[0]], { minPlayers: 1, maxPlayers: 1 });

        expect(g.toJson()).toEqual({
            deck: {
                ...deck.toJson(),
            },
            hasStarted: false,
            isReady: true,
            turns: {
                currentPhase: 'draw_phase',
                currentTurn: [],
                order: [PLAYER_ONE],
                baseOrder: [PLAYER_ONE],
                turn: 0,
                log: [],
            }
        });
    });

    it('works correctly the actions', () => {
        const deck = Deck.makeFromConfig(CARDS.DECKS.CONFIG[CARDS.TYPES.FRENCH]);
        const g = new SingleDeckCardGame(deck, PLAYERS);

        let result = g.action(PLAYER_ONE, CARD_GAME_ACTIONS.DRAW);
        expect(result).toEqual({
            success: true,
            payload: {
                hand: expect.objectContaining({
                    ownerId: PLAYER_ONE,
                    cards: expect.arrayContaining([
                        expect.objectContaining({
                            id: 'diamonds_13',
                            seed: 'diamonds',
                            value: 13,
                        })
                    ])
                }),
                card: expect.objectContaining({
                    id: 'diamonds_13',
                    seed: 'diamonds',
                    value: 13,
                })
            }
        });


        result = g.action(PLAYER_ONE, CARD_GAME_ACTIONS.DRAW);
        expect(result).toEqual({
            success: true,
            payload: {
                hand: expect.objectContaining({
                    ownerId: PLAYER_ONE,
                    cards: expect.arrayContaining([
                        expect.objectContaining({
                            id: 'diamonds_13',
                            seed: 'diamonds',
                            value: 13,
                        }),
                        expect.objectContaining({
                            id: 'diamonds_12',
                            seed: 'diamonds',
                            value: 12,
                        })
                    ])
                }),
                card: expect.objectContaining({
                    id: 'diamonds_12',
                    seed: 'diamonds',
                    value: 12,
                })
            }
        });
        expect(g.toJson().turns.currentPhase).toBe('play_phase');

        // Play Card

    });


});