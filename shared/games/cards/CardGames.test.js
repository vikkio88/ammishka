const { CARDS } = require('.');
const { SingleDeckCardGame } = require('./CardGames');
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
                currentTurn: [],
                order: [PLAYER_ONE],
                baseOrder: [PLAYER_ONE],
                turn: 0,
                log: [],
            }
        });
    });
});