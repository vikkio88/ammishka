const { GameServer, Client, Room } = require('./Server');
class Game {

    action(playerId, type, payload = {}) {

    }

    isReady() {
        return false;
    }

    setServer(
        /** @type GameServer */
        server
    ) {
        this.server = server;
    }

    /** @returns GameServer */
    getServer(){
        return this.server || new GameServer(
            new Client(),
            new Room()
        );
    }

    toJson() {
        return {

        };
    }
}

module.exports = Game;