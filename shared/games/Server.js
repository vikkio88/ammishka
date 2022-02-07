class GameServer {
    constructor(client, room) {
        this.client = client;
        this.room = room;
    }

    gameStateUpdate(newGameState) {
        this.room.broadcast(newGameState);
    }

    reportResult(result) {
        this.client.result(result);
    }

    notify(event) {
        this.room.notify(event);
    }
}

class Room {
    broadcast(payload) {
        console.log('server:broadcasting', payload);
    }

    notify(payload) {
        console.log('server:notifying', payload);
    }
}

class Client {
    result(result) {
        console.log('client:reporting', result);
    }
}

module.exports = {
    GameServer,
    Room,
    Client
};