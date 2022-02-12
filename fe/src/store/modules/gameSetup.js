import { CARDS } from 'ammishka-shared/games';
import { USER_TYPES } from 'ammishka-shared/types';
import a from '../actions';

const INITIAL_STATE = {
    gameSetup: {
        type: Object.values(CARDS.GAMES)[0],
        name: '',
        players: [],
        nonPlayers: [],
        isDirty: false,
        isValid: false
    },
};

const gameSetup = store => {
    store.on(a.INIT, () => ({ ...INITIAL_STATE }));

    store.on(a.GAME_SETUP.SET, ({ gameSetup }, setup = {}) => {
        if (setup === null) {
            return {
                ...INITIAL_STATE
            };
        }


        return {
            gameSetup: {
                ...gameSetup,
                ...setup
            }
        };
    });

    store.on(a.GAME_SETUP.ADD_PLAYER, ({ gameSetup }, { player } = {}) => {
        const newPlayers = [...gameSetup.players, player];
        // validate
        const isValid = true;
        return {
            gameSetup: {
                ...gameSetup,
                players: newPlayers,
                isDirty: true,
                isValid
            }
        };
    });

    store.on(a.GAME_SETUP.ADD_NON_PLAYER, ({ gameSetup }, { nonPlayer, type } = {}) => {
        // atm the only non player is BOARD
        nonPlayer.type = USER_TYPES.BOARD;

        const newNonPlayers = [...gameSetup.nonPlayers, nonPlayer];
        // validate
        const isValid = true;
        return {
            gameSetup: {
                ...gameSetup,
                nonPlayers: newNonPlayers,
                isDirty: true,
                isValid
            }
        };
    });

    store.on(a.GAME_SETUP.REMOVE_USER, ({ gameSetup }, { id } = {}) => {
        const newPlayers = [...gameSetup.players].filter(u => u.id !== id);
        const newNonPlayers = [...gameSetup.nonPlayers].filter(u => u.id !== id);

        // validate
        const isValid = true;
        return {
            gameSetup: {
                ...gameSetup,
                players: newPlayers,
                nonPlayers: newNonPlayers,
                isDirty: true,
                isValid
            }
        };

    });

    store.on(a.GAME_SETUP.SET_PLAYERS, ({ gameSetup }, { players } = {}) => {
        // validate
        const isValid = true;
        return {
            gameSetup: {
                ...gameSetup,
                players,
                isDirty: true,
                isValid
            }
        };
    });
};


export default gameSetup;