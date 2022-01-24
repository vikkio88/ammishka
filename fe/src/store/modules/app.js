import { EVENTS, GAME_ACTIONS } from 'ammishka-shared/fe';
import socket from '../../libs/socket';
import a from '../actions';

const events = store => ({
  // @TODO: use this to forward to single action
  [EVENTS.MESSAGE]: msg => {
    console.log('message', msg);

    const { type, ...payload } = msg?.payload || {};
    switch (type) {
      case GAME_ACTIONS.CREATED_ROOM: {
        store.dispatch(a.GAME.ACTIONS.ROOM_CREATED, payload);
        store.dispatch(a.APP.LOADING_STOP);
        return;
      }
      case GAME_ACTIONS.JOINED_ROOM: {
        store.dispatch(a.GAME.ACTIONS.ROOM_JOINED, payload);
        store.dispatch(a.APP.LOADING_STOP);
        return;
      }

      default: {
        console.error('unknown message', msg);
      }

    }
  }
});

const INITIAL_APP_STATE = {
  app: {
    id: null,
    isConnected: false,
    isLoading: false,
    room: null,
    error: null,
  },
};

const app = store => {
  store.on(a.INIT, () => ({ ...INITIAL_APP_STATE }));
  store.on(a.APP.LOADING_START, ({ app }) => ({ app: { ...app, isLoading: true } }));
  store.on(a.APP.LOADING_STOP, ({ app }, payload = {}) => ({ app: { ...app, ...payload, isLoading: false } }));

  store.on(a.APP.MERGE_STATE, ({ app }, payload = {}) => ({ app: { ...app, ...payload } }));

  store.on(a.APP.CREATE, async () => {
    store.dispatch(a.APP.LOADING_START);
    await socket.init(events(store));
    await socket.createRoom();
    // here we are not loadingStop as waiting for the room to be created
    store.dispatch(a.APP.MERGE_STATE, { id: socket.id, isConnected: true });
  });


  store.on(a.APP.JOIN, async ({ app }, { roomId }) => {
    store.dispatch(a.APP.LOADING_START);
    await socket.init(events(store));
    await socket.joinRoom(roomId);
    store.dispatch(a.APP.MERGE_STATE, { id: socket.id, isConnected: true });

    // maybe this and App.Create could be one to init
  });

};


export default app;
