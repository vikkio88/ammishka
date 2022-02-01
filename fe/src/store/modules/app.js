import { EVENTS, ROOM_ACTIONS } from 'ammishka-shared/fe';
import { ammuzzu } from 'ammishka-shared/libs/ammuzzu';
import socket from '../../libs/socket';
import { TAKEOVER_TYPES } from '../../enums';
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

      case ROOM_ACTIONS.ADMIN_CMD: {
        store.dispatch(a.GAME.RCV_ADMIN_CMD, payload);
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
  [EVENTS.NOTIFICATION]: msg => {
    console.log('NOTIFICATION RECEIVED', msg);
    // todo: check standard notification message
    const { message } = msg;
    store.dispatch(a.UI.NOTIFICATION.SHOW, { message });
  }
});

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
