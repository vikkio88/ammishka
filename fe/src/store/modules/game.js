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
};

export default game;