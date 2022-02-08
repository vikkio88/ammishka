const { Client, GameServer, Room } = require('ammishka-shared/games/Server');
const { EVENTS: e } = require('ammishka-shared/events');
const { ROOM_ACTIONS } = require('ammishka-shared/actions');

class IoClient extends Client {
    constructor(socket) {
        this.socket = socket;
    }

    result(result) {
        result.payload.type = ROOM_ACTIONS.GAME_ACTIONS.RESULT;
        this.socket.emit(e.MESSAGE, result);
    }
}

class IoRoom extends Room {
    constructor(io, roomId) {
        this.room = io.to(roomId);
    }

    broadcast(payload) {
        this.socket.emit(e.MESSAGE, { payload: { type: ROOM_ACTIONS.GAME_STATE_UPDATE, ...payload } });
    }

    notify(payload) {
        console.log('server:notifying', payload);
        this.socket.emit(e.NOTIFICATION, { message: payload });
    }
}

const makeIoGameServer = ({ server, socket, roomId }) => {
    const room = new IoRoom(server, roomId);
    const client = new IoClient(socket);
    return new GameServer(client, room);
};

module.exports = makeIoGameServer;