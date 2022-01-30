
const { ROOM_ACTIONS } = require('ammishka-shared/actions');
const { EVENTS: e } = require('ammishka-shared/events');

const RoomsManager = require('../libs/RoomsManager');

// use env.LOG_LEVEL
const defaultLogger = (...args) => console.log(args);

const makeActionHandler = (
    socket,
    /** @type Server */
    io,
    /** @type RoomsManager */
    roomManager,
    logger = defaultLogger) => {
    const id = socket.id;

    return ({ type, payload = {} } = {}) => {
        switch (type) {
            case ROOM_ACTIONS.CREATE_ROOM: {
                const result = roomManager.make(socket);
                logger(`room creation payload:`, payload);
                logger(`room created ${result.payload.roomId}`);
                socket.emit(e.MESSAGE, result);
                socket.join(result.payload.roomId);
                return;
            }
            case ROOM_ACTIONS.JOIN_ROOM: {
                const { roomId } = payload;
                const result = roomManager.join(roomId, socket);
                logger(`room joined`, result);
                socket.join(roomId);
                // broadcasting to Room
                io.to(roomId).emit(e.MESSAGE, result);
                return;
            }
            case ROOM_ACTIONS.LEAVE_ROOM: {
                const { roomId } = payload;
                const result = roomManager.leave(roomId, socket);
                logger(`room left`, result);
                socket.leave(roomId);

                // telling user he left
                socket.emit(e.MESSAGE, result);
                // broadcasting to Room user left
                io.to(roomId).emit(e.MESSAGE, result);
                return;
            }

            case ROOM_ACTIONS.ROOM_ACTION: {
            }

            case ROOM_ACTIONS.TEST: {
                logger(`${id} - test ping: `, { type, payload });
                socket.emit(e.MESSAGE, { received: true, payload: { type: type, payload } });
                return;
            }
            default: {
                // this should be error
                logger(`${id} sent invalid message: `, { type, payload });
                return;
            }

        };
    };
};

module.exports = makeActionHandler;