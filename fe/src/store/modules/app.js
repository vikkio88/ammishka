import { EVENTS, ROOM_ACTIONS } from 'ammishka-shared/fe';
import socket from '../../libs/socket';
import a from '../actions';

// @TODO: move this somewhere else
const events = store => ({
  // @TODO: use this to forward to single action
  [EVENTS.MESSAGE]: msg => {
    console.log('client:received_message:', msg);
    const me = store.get()?.app?.id;
    console.log('me:', me || null);

    const { type, ...payload } = msg?.payload || {};
    switch (type) {
      case ROOM_ACTIONS.CREATED_ROOM: {
        store.dispatch(a.GAME.ACTIONS.ROOM_CREATED, payload);
        store.dispatch(a.APP.LOADING_STOP);
        return;
      }
      case ROOM_ACTIONS.JOINED_ROOM: {
        store.dispatch(a.GAME.ACTIONS.ROOM_JOINED, payload);
        store.dispatch(a.APP.LOADING_STOP);
        return;
      }
      case ROOM_ACTIONS.LEFT_ROOM: {
        store.dispatch(a.GAME.ACTIONS.ROOM_LEFT, payload);
        const newAppState = payload.userId === me ? { ...INITIAL_APP_STATE.app } : {};
        store.dispatch(a.APP.LOADING_STOP, newAppState);
        return;
      }

      case ROOM_ACTIONS.TEST: {
        console.log('test msg received', { type, payload });
        return;
      }

      default: {
        console.error('error: unknown message format', msg);
        return;
      }

    }
  },
  [EVENTS.NOTIFICATION]: msg => console.log('NOTIFICATION RECEIVED', msg)
});

const INITIAL_APP_STATE = {
  app: {
    id: null,
    isConnected: false,
    isLoading: false,
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

  store.on(a.APP.LEAVE, async ({ game }) => {
    const { room: { id } } = game;
    store.dispatch(a.APP.LOADING_START);
    await socket.leaveRoom(id);
  });

};


export default app;
