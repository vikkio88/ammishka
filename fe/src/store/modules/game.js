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

    store.on(a.GAME.ADMIN_CMD, ({ game }, { command }) => {
        const { id } = game.room;
        socket.adminCommand(id, command);
    });

    store.on(a.GAME.RCV_ADMIN_CMD, ({ }, payload) => {
        const { command } = payload;

        switch (command) {
            case ROOM_ACTIONS.ADMIN_CMDS.IDENTIFY: {
                store.dispatch(a.MISC.IDENTIFY);
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
};

export default game;