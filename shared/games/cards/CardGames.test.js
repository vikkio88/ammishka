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
            phase: expect.objectContaining({
                current: 'draw_phase',
            }),
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
            phase: expect.objectContaining({
                current: 'draw_phase',
            }),
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

        expect(g.toJson().turns.currentPhase).toBe('draw_phase');
        expect(g.toJson().phase).toEqual({
            current: 'draw_phase',
            actionsInPhase: ['draw'],
            all: [
                'draw_phase',
                'play_phase',
            ],
            allActions: expect.any(Object),
            next: 'play_phase'
        });

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
                drawnCard: expect.objectContaining({
                    id: 'diamonds_13',
                    seed: 'diamonds',
                    value: 13,
                })
            }
        });

        expect(g.toJson().turns.currentPhase).toBe('play_phase');

        result = g.action(PLAYER_ONE, CARD_GAME_ACTIONS.DRAW);
        expect(result).toEqual({
            success: false,
            payload: {
                reason: expect.stringContaining('Cannot do draw on play_phase')
            }
        });

        result = g.action(PLAYER_ONE, CARD_GAME_ACTIONS.LOOK_AT_OWN_HAND);
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
                })
            }
        });

        expect(g.toJson().turns.currentPhase).toBe('play_phase');
        expect(g.toJson().phase).toEqual({
            current: 'play_phase',
            actionsInPhase: ['play_card'],
            all: [
                'draw_phase',
                'play_phase',
            ],
            allActions: expect.any(Object),
            next: null
        });

        // Play Card without card id
        result = g.action(PLAYER_ONE, CARD_GAME_ACTIONS.PLAY_CARD);
        expect(result).toEqual({
            success: false,
            payload: {
                reason: expect.stringContaining('condition failed')
            }
        });

        // playing card not in hand
        result = g.action(PLAYER_ONE, CARD_GAME_ACTIONS.PLAY_CARD, { cardId: 'diamonds_12' });
        expect(result).toEqual({
            success: false,
            payload: {
                reason: expect.stringContaining('condition failed')
            }
        });

        // playing card correctly
        result = g.action(PLAYER_ONE, CARD_GAME_ACTIONS.PLAY_CARD, { cardId: 'diamonds_13' });
        expect(result).toEqual({
            success: true,
            payload: {
                hand: {
                    ownerId: PLAYER_ONE,
                    cards: [],
                },
                playedCard: expect.objectContaining({
                    id: 'diamonds_13',
                    seed: 'diamonds',
                    value: 13,
                })
            }
        });


        // checking other turn now
        let gameState = g.toJson();
        expect(gameState.turns.order).toEqual([PLAYER_TWO]);
        expect(gameState.turns.turn).toEqual(0);
        expect(gameState.turns.currentPhase).toBe('draw_phase');
        expect(gameState.turns.currentTurn).toEqual([
            [PLAYER_ONE, { type: 'draw', payload: {} }],
            [PLAYER_ONE, { type: 'look_at_own_hand', payload: {} }],
            [PLAYER_ONE, { type: 'play_card', payload: { cardId: 'diamonds_13' } }],
        ]);


        // now is turn for player 2
        // check if player 1 is stopped from playing
        result = g.action(PLAYER_ONE, CARD_GAME_ACTIONS.DRAW);
        expect(result).toEqual({
            success: false,
            payload: {
                reason: expect.stringContaining('condition failed')
            }
        });


        // now player 2 draws
        result = g.action(PLAYER_TWO, CARD_GAME_ACTIONS.DRAW);
        expect(result).toEqual({
            success: true,
            payload: {
                hand: expect.objectContaining({
                    ownerId: PLAYER_TWO,
                    cards: expect.arrayContaining([
                        expect.objectContaining({
                            id: 'diamonds_12',
                            seed: 'diamonds',
                            value: 12,
                        })
                    ])
                }),
                drawnCard: expect.objectContaining({
                    id: 'diamonds_12',
                    seed: 'diamonds',
                    value: 12,
                })
            }
        });
        expect(g.toJson().turns.currentPhase).toBe('play_phase');

        result = g.action(PLAYER_TWO, CARD_GAME_ACTIONS.PLAY_CARD, { cardId: 'diamonds_12' });
        expect(result).toEqual({
            success: true,
            payload: {
                hand: {
                    ownerId: PLAYER_TWO,
                    cards: [],
                },
                playedCard: expect.objectContaining({
                    id: 'diamonds_12',
                    seed: 'diamonds',
                    value: 12,
                })
            }
        });

        gameState = g.toJson();
        expect(gameState.turns.order).toEqual([PLAYER_ONE, PLAYER_TWO]);
        expect(gameState.turns.turn).toEqual(1);
        expect(gameState.turns.currentPhase).toBe('draw_phase');
        expect(gameState.turns.currentTurn).toEqual([]);
        expect(gameState.turns.log).toEqual([
            [//first turn
                [PLAYER_ONE, { type: 'draw', payload: {} }],
                [PLAYER_ONE, { type: 'look_at_own_hand', payload: {} }],
                [PLAYER_ONE, { type: 'play_card', payload: { cardId: 'diamonds_13' } }],
                [PLAYER_TWO, { type: 'draw', payload: {} }],
                [PLAYER_TWO, { type: 'play_card', payload: { cardId: 'diamonds_12' } }],
            ]
        ]);

    });


});