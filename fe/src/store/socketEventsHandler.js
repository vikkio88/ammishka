import { EVENTS, ROOM_ACTIONS, ERRORS } from 'ammishka-shared/fe';
import a from './actions';

const makeEventHandler = store => ({
    // @TODO: use this to forward to single action
    [EVENTS.MESSAGE]: msg => {
        console.log('client:received_message:', msg);
        const me = store.get()?.app?.id;
        console.log('me:', me || null);
        if (msg.success !== undefined && msg.success === false) {
            //TODO: make this action to takeover/toast
            console.error(`ERROR REPORTED ON SERVER`, msg);

            if (msg.payload.reason === ERRORS.ROOM.NOT_FOUND) {
                store.dispatch(a.INIT);
                setTimeout(
                    () => store.dispatch(a.UI.NOTIFICATION.SHOW, { message: 'Room Not Found, Resetting...' }),
                    800
                );
            }
            return;
        }

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
                if (payload.userId === me) {
                    store.dispatch(a.INIT);
                }
                return;
            }

            case ROOM_ACTIONS.ADMIN_CMD: {
                store.dispatch(a.GAME.RCV_ADMIN_CMD, payload);
                return;
            }

            case ROOM_ACTIONS.GAME_ACTIONS.RESULT: {
                //store.dispatch(a.GAME.RCV_ADMIN_CMD, payload);
                console.log(`GAME ACTION RESULT`, payload);
                return;
            }

            case ROOM_ACTIONS.STATE_UPDATE: {
                store.dispatch(a.GAME.STATE_UPDATE, payload);
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


export { makeEventHandler };