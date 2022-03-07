const { CARDS } = require('.');
const { USER_TYPES } = require('../../types');
const { SingleDeckCardGame, ACTIONS_CONFIG: { actions: CARD_GAME_ACTIONS } } = require('./CardGames');
const Deck = require('./Deck');

const PLAYER_ONE = 'idPlayer1';
const PLAYER_TWO = 'idPlayer2';
const PLAYERS = [{ id: PLAYER_ONE }, { id: PLAYER_TWO }];

describe('SingleDeckCardGame specs', () => {
    it('builds the game correctly', () => {
        const deck = Deck.makeFromConfig(CARDS.DECKS.CONFIG[CARDS.TYPES.FRENCH]);
        let g = new SingleDeckCardGame(deck, PLAYERS);
        g.setName('someName');
        g.setType('someType');

        expect(g.toJson()).toEqual({
            name: 'someName',
            type: 'someType',
            players: expect.arrayContaining([
                expect.objectContaining({ id: PLAYER_ONE }),
                expect.objectContaining({ id: PLAYER_TWO }),
            ]),
            nonPlayers: [],
            deck: {
                ...deck.toJson(),
            },
            hasStarted: false,
            isReady: true,
            isFinished: false,
            phase: expect.objectContaining({
                current: 'draw_phase',
                actionsInPhase: ['draw'],
            }),
            availableActions: expect.arrayContaining(['draw']),
            turns: {
                currentPhase: 'draw_phase',
                currentTurn: [],
                order: [PLAYER_ONE, PLAYER_TWO],
                baseOrder: [PLAYER_ONE, PLAYER_TWO],
                turn: 0,
                log: [],
            },
            score: null,
            board: { ...g.board.toJson() },
        });

        g = new SingleDeckCardGame(deck, [PLAYERS[0]], { minPlayers: 1, maxPlayers: 1 });
        g.setName('someName');
        g.setType('someType');
        expect(g.toJson()).toEqual({
            name: 'someName',
            type: 'someType',
            players: expect.arrayContaining([
                expect.objectContaining({ id: PLAYER_ONE }),
            ]),
            nonPlayers: [],
            deck: {
                ...deck.toJson(),
            },
            hasStarted: false,
            isReady: true,
            isFinished: false,
            phase: expect.objectContaining({
                current: 'draw_phase',
                actionsInPhase: ['draw'],
            }),
            availableActions: expect.arrayContaining(['draw']),
            turns: {
                currentPhase: 'draw_phase',
                currentTurn: [],
                order: [PLAYER_ONE],
                baseOrder: [PLAYER_ONE],
                turn: 0,
                log: [],
            },
            score: null,
            board: { ...g.board.toJson() },
        });

        g = new SingleDeckCardGame(deck, [PLAYERS[0], { id: PLAYER_TWO, type: 'something else' }], { minPlayers: 1, maxPlayers: 1 });
        g.setName('someName');
        g.setType('someType');
        expect(g.toJson()).toEqual({
            name: 'someName',
            type: 'someType',
            players: expect.arrayContaining([
                { id: PLAYER_ONE }
            ]),
            nonPlayers: expect.arrayContaining([
                { id: PLAYER_TWO, type: 'something else' }
            ]),
            deck: {
                ...deck.toJson(),
            },
            hasStarted: false,
            isReady: true,
            isFinished: false,
            phase: expect.objectContaining({
                current: 'draw_phase',
                actionsInPhase: ['draw'],
            }),
            availableActions: expect.arrayContaining(['draw']),
            turns: {
                currentPhase: 'draw_phase',
                currentTurn: [],
                order: [PLAYER_ONE],
                baseOrder: [PLAYER_ONE],
                turn: 0,
                log: [],
            },
            score: null,
            board: { ...g.board.toJson() },
        });
    });

    it('Game turn test', () => {
        const deck = Deck.makeFromConfig(CARDS.DECKS.CONFIG[CARDS.TYPES.FRENCH]);
        const g = new SingleDeckCardGame(deck, [...PLAYERS, { id: 'theTable', type: USER_TYPES.BOARD }]);
        // turning error loggin off
        g.setLogging({ off: true });
        // so I dont get annoying output
        const gameServerMock = {
            gameStateUpdate: jest.fn(),
            reportResult: jest.fn(),
            notify: jest.fn()
        };
        g.setServer(gameServerMock);

        expect(g.toJson().nonPlayers).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: 'theTable', type: USER_TYPES.BOARD
            })
        ]));

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
            success: false,
            payload: {
                reason: expect.stringContaining(`hasn't started`)
            }
        });

        // starting the game
        g.start();
        expect(g.toJson().hasStarted).toBe(true);

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
        checkGameServerAsserts(gameServerMock, {
            notify: { message: expect.stringContaining('Drew') },
            gameStateUpdate: { turns: expect.objectContaining({ currentPhase: 'play_phase' }) },
            reportResult: { success: true }
        });


        expect(g.toJson().turns.currentPhase).toBe('play_phase');

        result = g.action(PLAYER_ONE, CARD_GAME_ACTIONS.DRAW);
        expect(result).toEqual({
            success: false,
            payload: {
                reason: expect.stringContaining('Not a valid action on this phase')
            }
        });
        checkGameServerAsserts(gameServerMock, {
            notify: false,
            gameStateUpdate: false,
            reportResult: { success: false }
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
        checkGameServerAsserts(gameServerMock, {
            notify: { message: expect.stringContaining('Looked') },
            gameStateUpdate: { turns: expect.objectContaining({ currentPhase: 'play_phase' }) },
            reportResult: { success: true }
        });


        expect(g.toJson().turns.currentPhase).toBe('play_phase');
        expect(g.toJson().phase).toEqual({
            current: 'play_phase',
            actionsInPhase: ['play_card', 'end_turn'],
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
                reason: expect.stringContaining(`Can't perform this action`)
            }
        });

        // playing card not in hand
        result = g.action(PLAYER_ONE, CARD_GAME_ACTIONS.PLAY_CARD, { cardId: 'diamonds_12' });
        expect(result).toEqual({
            success: false,
            payload: {
                reason: expect.stringContaining(`Can't perform this action`)
            }
        });
        checkGameServerAsserts(gameServerMock, {
            notify: false,
            gameStateUpdate: false,
            reportResult: { success: false }
        });

        // playing card correctly
        result = g.action(PLAYER_ONE, CARD_GAME_ACTIONS.PLAY_CARD, { cardId: 'diamonds_13', position: [1, 1], facing: 'up' });
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
        expect(g.toJson().board).toEqual(expect.objectContaining({
            cards: [expect.objectContaining({
                position: [1, 1],
                facing: 'up',
                card: {
                    id: 'diamonds_13',
                    seed: 'diamonds',
                    value: 13,
                }
            })]
        }));


        // checking other turn now
        let gameState = g.toJson();
        expect(gameState.turns.order).toEqual([PLAYER_TWO]);
        expect(gameState.turns.turn).toEqual(0);
        expect(gameState.turns.currentPhase).toBe('draw_phase');
        expect(gameState.turns.currentTurn).toEqual([
            [PLAYER_ONE, { type: 'draw', payload: {} }],
            [PLAYER_ONE, { type: 'look_at_own_hand', payload: {} }],
            [PLAYER_ONE, { type: 'play_card', payload: { cardId: 'diamonds_13', position: [1, 1], facing: 'up' } }],
        ]);
        checkGameServerAsserts(gameServerMock, {
            notify: { message: expect.stringContaining('Played') },
            gameStateUpdate: { turns: expect.objectContaining({ currentPhase: 'draw_phase' }) },
            reportResult: { success: true }
        });


        // now is turn for player 2
        // check if player 1 is stopped from playing
        result = g.action(PLAYER_ONE, CARD_GAME_ACTIONS.DRAW);
        expect(result).toEqual({
            success: false,
            payload: {
                reason: expect.stringContaining(`Can't perform this action`)
            }
        });
        checkGameServerAsserts(gameServerMock, {
            notify: false,
            gameStateUpdate: false,
            reportResult: { success: false }
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
        checkGameServerAsserts(gameServerMock, {
            notify: { message: expect.stringContaining('Drew') },
            gameStateUpdate: { turns: expect.objectContaining({ currentPhase: 'play_phase' }) },
            reportResult: { success: true }
        });

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
        checkGameServerAsserts(gameServerMock, {
            notify: { message: expect.stringContaining('Played') },
            gameStateUpdate: { ...gameState },
            reportResult: { success: true }
        });

        expect(gameState.turns.order).toEqual([PLAYER_ONE, PLAYER_TWO]);
        expect(gameState.turns.turn).toEqual(1);
        expect(gameState.turns.currentPhase).toBe('draw_phase');
        expect(gameState.turns.currentTurn).toEqual([]);
        expect(gameState.turns.log).toEqual([
            [//first turn
                [PLAYER_ONE, { type: 'draw', payload: {} }],
                [PLAYER_ONE, { type: 'look_at_own_hand', payload: {} }],
                [PLAYER_ONE, { type: 'play_card', payload: { cardId: 'diamonds_13', position: [1, 1], facing: 'up' } }],
                [PLAYER_TWO, { type: 'draw', payload: {} }],
                [PLAYER_TWO, { type: 'play_card', payload: { cardId: 'diamonds_12' } }],
            ]
        ]);

        // add a second turn test where you test how to end phases and turn

        // ending a turn
        // now player 2 draws
        result = g.action(PLAYER_ONE, CARD_GAME_ACTIONS.DRAW);
        expect(result).toEqual({
            success: true,
            payload: {
                hand: expect.objectContaining({
                    ownerId: PLAYER_ONE,
                    cards: expect.arrayContaining([
                        expect.objectContaining({
                            id: 'diamonds_11',
                            seed: 'diamonds',
                            value: 11,
                        })
                    ])
                }),
                drawnCard: expect.objectContaining({
                    id: 'diamonds_11',
                    seed: 'diamonds',
                    value: 11,
                })
            }
        });
        gameState = g.toJson();
        expect(gameState.turns.currentPhase).toBe('play_phase');
        result = g.action(PLAYER_ONE, CARD_GAME_ACTIONS.END_TURN);
        expect(result).toEqual({
            success: true,
            payload: {}
        });

        gameState = g.toJson();
        expect(gameState.turns.order).toEqual([PLAYER_TWO]);
        expect(gameState.turns.currentPhase).toBe('draw_phase');
        checkGameServerAsserts(gameServerMock, {
            notify: { message: expect.stringContaining('Ended') },
            gameStateUpdate: { ...gameState },
            reportResult: { success: true }
        });

        result = g.action(PLAYER_TWO, CARD_GAME_ACTIONS.DRAW);
        expect(result).toEqual({
            success: true,
            payload: {
                hand: expect.objectContaining({
                    ownerId: PLAYER_TWO,
                    cards: expect.arrayContaining([
                        expect.objectContaining({
                            id: 'diamonds_10',
                            seed: 'diamonds',
                            value: 10,
                        })
                    ])
                }),
                drawnCard: expect.objectContaining({
                    id: 'diamonds_10',
                    seed: 'diamonds',
                    value: 10,
                })
            }
        });

        g.stop();
        expect(g.isFinished).toBe(true);

        result = g.action(PLAYER_ONE, CARD_GAME_ACTIONS.DRAW);
        expect(result).toEqual({
            success: false,
            payload: {
                reason: expect.stringContaining(`is finished`)
            }
        });
    });

    it('[REGRESSION] Game sharing order and removing old base order turn', () => {
        const deck = Deck.makeFromConfig(CARDS.DECKS.CONFIG[CARDS.TYPES.FRENCH]);
        const g = new SingleDeckCardGame(deck, [...PLAYERS, { id: 'theTable', type: USER_TYPES.BOARD }]);
        // turning error loggin off
        g.setLogging({ off: true });
        const gameServerMock = {
            gameStateUpdate: jest.fn(),
            reportResult: jest.fn(),
            notify: jest.fn()
        };
        g.setServer(gameServerMock);
        g.start();


        let result = g.action(PLAYER_ONE, CARD_GAME_ACTIONS.DRAW);
        expect(result).toEqual(expect.objectContaining({ success: true }));
        result = g.action(PLAYER_ONE, CARD_GAME_ACTIONS.END_TURN);
        expect(result).toEqual(expect.objectContaining({ success: true }));
        // player 2
        result = g.action(PLAYER_TWO, CARD_GAME_ACTIONS.DRAW);
        expect(result).toEqual(expect.objectContaining({ success: true }));
        result = g.action(PLAYER_TWO, CARD_GAME_ACTIONS.END_TURN);
        expect(result).toEqual(expect.objectContaining({ success: true }));

        expect(g.toJson().turns.order).not.toEqual([]);
        expect(g.toJson().turns.baseOrder).not.toEqual([]);

        // turn 2
        result = g.action(PLAYER_ONE, CARD_GAME_ACTIONS.DRAW);
        expect(result).toEqual(expect.objectContaining({ success: true }));
        result = g.action(PLAYER_ONE, CARD_GAME_ACTIONS.END_TURN);
        expect(result).toEqual(expect.objectContaining({ success: true }));
        // player 2
        result = g.action(PLAYER_TWO, CARD_GAME_ACTIONS.DRAW);
        expect(result).toEqual(expect.objectContaining({ success: true }));
        result = g.action(PLAYER_TWO, CARD_GAME_ACTIONS.END_TURN);
        expect(result).toEqual(expect.objectContaining({ success: true }));

        expect(g.toJson().turns.order).not.toEqual([]);
        expect(g.toJson().turns.baseOrder).not.toEqual([]);
    });



});

const checkGameServerAsserts = (gameServerMock, { notify = false, gameStateUpdate = false, reportResult = false }) => {
    if (!notify) {
        expect(gameServerMock.notify).not.toHaveBeenCalled();
    } else {
        expect(gameServerMock.notify).toHaveBeenCalledWith(expect.objectContaining({
            ...notify
        }));
    }

    if (!gameStateUpdate) {
        expect(gameServerMock.gameStateUpdate).not.toHaveBeenCalled();
    } else {
        expect(gameServerMock.gameStateUpdate).toHaveBeenCalledWith(expect.objectContaining({
            game: expect.objectContaining({ ...gameStateUpdate })
        }));
    }

    if (!reportResult) {
        expect(gameServerMock.reportResult).not.toHaveBeenCalled();
    } else {
        expect(gameServerMock.reportResult).toHaveBeenCalledWith(expect.objectContaining({
            ...reportResult
        }));
    }

    gameServerMock.notify.mockClear();
    gameServerMock.gameStateUpdate.mockClear();
    gameServerMock.reportResult.mockClear();

};