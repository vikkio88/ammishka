const { ROOM_ACTIONS } = require('ammishka-shared/actions');
const { EVENTS: e } = require('ammishka-shared/events');

// use env.LOG_LEVEL
const defaultLogger = message => console.log(message);

const makeActionHandler = (socket, io, roomManager, logger = defaultLogger) => {

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
            default: {
                logger(`${id}: `, { type, payload });
                socket.emit(e.MESSAGE, { received: true, type: type });
                return;
            }

        };
    };
};

module.exports = makeActionHandler;