
const { ROOM_ACTIONS } = require('ammishka-shared/actions');
const { EVENTS: e } = require('ammishka-shared/events');
const makeIoGameServer = require('../libs/GameIo');

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
    const broadcast = roomId => io.to(roomId);

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
                broadcast(roomId).emit(e.NOTIFICATION, { message: 'User Joined' });
                socket.join(roomId);
                // broadcasting to Room
                broadcast(roomId).emit(e.MESSAGE, result);
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
                broadcast(roomId).emit(e.MESSAGE, result);
                return;
            }

            case ROOM_ACTIONS.GAME_ACTION: {
                const playerId = id;
                const { roomId, action, payload } = payload;
                const result = roomManager.getRoomforPlayerId(roomId, id);
                if (!result.success) {
                    socket.emit(e.MESSAGE, result);
                }
                const { room } = result;
                const game = room.getGame();
                game.setServer(makeIoGameServer({ server: io, socket, roomId }));

                // this already broadcasts/emits
                game.action(playerId, action, payload);
                return;
            }

            case ROOM_ACTIONS.ADMIN_CMD: {
                const { roomId, command, payload: commandPayload } = payload;
                const result = roomManager.adminCommand({ id }, roomId, command, commandPayload);
                if (result.success) {
                    // to admin
                    // socker.emit()
                    broadcast(roomId).emit(e.MESSAGE, result);
                    return;
                }
                // this is an error
                socket.emit(e.MESSAGE, result);
                // error logging?
                console.error('error', result);
                return;
            }

            case ROOM_ACTIONS.TEST: {
                logger(`${id} - test ping: `, { type, payload });
                socket.emit(e.MESSAGE, { received: true, payload: { type: type, payload } });
                socket.emit(e.NOTIFICATION, { message: 'Test' });
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