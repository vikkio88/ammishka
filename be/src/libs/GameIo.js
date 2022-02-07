const { Client, GameServer, Room } = require('ammishka-shared/games/Server');

class IoClient extends Client {
    constructor(socket) {
        this.socket = socket;
    }

    result(result) {

    }
}

class IoRoom extends Room {
    constructor(io, roomId) {
        this.room = io.to(roomId);
    }

    broadcast(payload) {
        console.log('server:broadcasting', payload);
    }

    notify(payload) {
        console.log('server:notifying', payload);
    }
}

const makeIoGameServer = ({ server, socket, roomId }) => {
    const room = new IoRoom(server, roomId);
    const client = new IoClient(socket);
    return new GameServer(client, room);
};

module.exports = makeIoGameServer;