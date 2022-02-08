const { GameServer, Client, Room } = require('./Server');
class Game {
    setName(name) {
        this.name = name;
    }

    setLogging({ off = false }) {
        this.logging = { off };
    }

    canLog() {
        return (!Boolean(this.logging) || !this.logging.off);
    }

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
    getServer() {
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