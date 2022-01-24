import socket from '../../libs/socket';
import a from '../actions';

const INITIAL_APP_STATE = {
    game: {
        room: null,
    },
};

const game = store => {
    store.on(a.INIT, () => ({ ...INITIAL_APP_STATE }));

    store.on(a.GAME.ACTION, () => {
        socket.action();
    });

    store.on(a.GAME.ACTIONS.ROOM_CREATED, ({ game }, payload) => {
        const { room } = payload;
        console.log('on store game', payload);
        return {
            game: {
                ...game,
                room
            }
        };
    });
};

export default game;