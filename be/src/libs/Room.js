const { GAME_ACTIONS } = require('ammishka-shared/actions');
const { ERRORS } = require('ammishka-shared/errors');
const { actionResult: a_r } = require('ammishka-shared/payloads');

const Game = require('./Game');

const defaultRoomOptions = {
    /** @type Number */
    maxUsers: 4,
    /** @type Number */
    minUsers: 2,
};


class Room {
    constructor(id, admin, options = {}) {
        this.id = id;
        this.options = { ...defaultRoomOptions, ...options };
        this.adminId = admin.id;

        this.users = new Map();
        this.users.set(admin.id, admin);

        /**@type Game */
        this.game = null;
    }

    setGame(
        /**@type Game */
        game
    ) {
        this.game = game;
    }
    isGameReady() {
        // if no game is set does not matter
        if (!this.game) return true;

        return this.game.isReady();
    }

    isReady() {
        return (this.users.size >= this.options.minUsers) && this.isGameReady();
    }

    join(user) {
        if (this.users.size + 1 > this.options.maxUsers) {
            return a_r(false, { reason: ERRORS.ROOM.FULL });
        }

        this.users.set(user.id, user);

        return a_r(true, {
            type: GAME_ACTIONS.JOINED_ROOM,
            userId: user.id,
            room: this.toJson()
        });
    }


    leave(user) {
        if (!this.users.has(user.id)) {
            return a_r(false, { reason: ERRORS.ROOM.USER_NOT_FOUND });
        }

        this.users.delete(user.id);

        return a_r(true, { type: GAME_ACTIONS.LEFT_ROOM, userId: user.id });
    }

    toJson() {
        return {
            id: this.id,
            adminId: this.adminId,
            isReady: this.isReady(),
            users: Array.from(this.users).map(e => e[0])
        };
    }
}

module.exports = Room;