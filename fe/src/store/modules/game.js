import { ROOM_ACTIONS } from 'ammishka-shared/actions';
import socket from '../../libs/socket';
import a from '../actions';

const INITIAL_APP_STATE = {
    game: {
        room: null,
        admin: false
    },
};

const game = store => {
    store.on(a.INIT, () => ({ ...INITIAL_APP_STATE }));

    store.on(a.GAME.TEST_ACTION, () => {
        socket.testAction({ some: 'info' });
    });

    store.on(a.GAME.ACTION, () => {
        //socket.testAction();
    });

    store.on(a.GAME.ADMIN_CMD, ({ game }, { command, payload = {} }) => {
        const { id } = game.room;
        socket.adminCommand(id, command, payload);
    });

    store.on(a.GAME.RCV_ADMIN_CMD, (_, payload) => {
        const { command } = payload;

        switch (command) {
            case ROOM_ACTIONS.ADMIN_CMDS.IDENTIFY: {
                store.dispatch(a.MISC.IDENTIFY);
                return;
            }
            default: {
                console.error(`admin:cmd:${command}, cannot comply`);
                return;
            }
        }

    });

    store.on(a.GAME.ACTIONS.ROOM_CREATED, ({ game }, payload) => {
        const { room } = payload;
        return {
            game: {
                ...game,
                admin: true,
                room
            }
        };
    });

    store.on(a.GAME.ACTIONS.ROOM_JOINED, ({ app, game }, payload) => {
        const { room } = payload;
        if (app.id === payload.userId) {
            // I am the one who joined
        }

        return {
            game: {
                ...game,
                room
            }
        };
    });

    store.on(a.GAME.ACTIONS.ROOM_LEFT, ({ app, game }, payload) => {
        const { room } = payload;

        if (app.id === payload.userId) {
            return {
                ...INITIAL_APP_STATE
            };
        }

        return {
            game: {
                ...game,
                room
            }
        };
    });

    store.on(a.GAME.STATE_UPDATE, ({ game }, payload) => {
        const { room } = payload;
        return {
            game: {
                ...game,
                room: {
                    ...room
                }
            }
        };
    });

    store.on(a.GAME.GAME_STATE_UPDATE, ({ game }, payload) => {

        return {
            game: {
                ...game,
                room: {
                    ...game.room,
                    game: {
                        ...payload
                    }
                }
            }
        };
    });
};

export default game;