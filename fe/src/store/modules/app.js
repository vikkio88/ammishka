import { EVENTS } from 'ammishka-shared/fe';
import socket from '../../libs/socket';
import a from '../actions';

const events = {
  [EVENTS.MESSAGE]: msg => console.log('message', msg)
};

let client = null;

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

  store.on(a.APP.CREATE, async () => {
    store.dispatch(a.APP.LOADING_START);
    client = await socket.init(events);

    await socket.createRoom();
    store.dispatch(a.APP.LOADING_STOP, { id: client.id, isConnected: true });
  });

  store.on(a.APP.JOIN, async ({ app }) => {
    console.log('join action');
    store.dispatch(a.APP.LOADING_START);
    await socket.join();
    store.dispatch(a.APP.LOADING_STOP);
  });

};


export default app;
