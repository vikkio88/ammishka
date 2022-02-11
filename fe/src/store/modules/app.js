
import { ammuzzu } from 'ammishka-shared/libs/ammuzzu';
import socket from '../../libs/socket';
import { TAKEOVER_TYPES } from '../../enums';
import a from '../actions';
import { makeEventHandler } from '../socketEventsHandler';

const INITIAL_APP_STATE = {
  app: {
    id: null,
    isConnected: false,
    isLoading: false,
  },
};

const app = store => {
  store.on(a.INIT, () => ({ ...INITIAL_APP_STATE }));
  store.on(a.APP.LOADING_START, ({ app }) => ({ app: { ...app, isLoading: true } }));
  store.on(a.APP.LOADING_STOP, ({ app }, payload = {}) => ({ app: { ...app, ...payload, isLoading: false } }));

  store.on(a.APP.MERGE_STATE, ({ app }, payload = {}) => ({ app: { ...app, ...payload } }));

  store.on(a.APP.CREATE, async () => {
    store.dispatch(a.APP.LOADING_START);
    await socket.init(makeEventHandler(store));
    await socket.createRoom();
    // here we are not loadingStop as waiting for the room to be created
    store.dispatch(a.APP.MERGE_STATE, { id: socket.id, isConnected: true });
  });


  store.on(a.APP.JOIN, async ({ app }, { roomId }) => {
    store.dispatch(a.APP.LOADING_START);
    await socket.init(makeEventHandler(store));
    await socket.joinRoom(roomId);
    store.dispatch(a.APP.MERGE_STATE, { id: socket.id, isConnected: true });

    // maybe this and App.Create could be one to init
  });

  store.on(a.APP.LEAVE, async ({ game }) => {
    const { room: { id } } = game;
    store.dispatch(a.APP.LOADING_START);
    await socket.leaveRoom(id);
  });


  store.on(a.MISC.IDENTIFY, ({ game, app }) => {
    const { room: { userMap, adminId } } = game;
    const { id } = app;
    const type = ammuzzu.pickOne(Object.values(TAKEOVER_TYPES));
    const user = userMap[id];
    //TODO: could also add the user type emoji since user has type here
    store.dispatch(a.UI.TAKEOVER.SHOW, {
      title: `${adminId === id ? '👑' : ''}`,
      content: `${user.name}`,
      type
    });
  });

};


export default app;
