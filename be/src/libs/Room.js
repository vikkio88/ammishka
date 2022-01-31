const { ROOM_ACTIONS } = require('ammishka-shared/actions');
const { ERRORS } = require('ammishka-shared/errors');
const { actionResult: a_r } = require('ammishka-shared/payloads');

const Game = require('./Game');
const User = require('./User');

const defaultRoomOptions = {
    /** @type Number */
    maxUsers: 4,
    /** @type Number */
    minUsers: 2,
};


class Room {
    constructor(
        /** @type String */
        id,
        /** @type User */
        admin,
        options = {}
    ) {
        this.id = id;
        this.options = { ...defaultRoomOptions, ...options };
        this.adminId = admin.id;

        /** @type User[] */
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

    isEmpty() {
        return this.users.size === 0;
    }

    isReady() {
        return (this.users.size >= this.options.minUsers) && this.isGameReady();
    }

    join(
        /** @type User */
        user
    ) {
        if (this.users.size + 1 > this.options.maxUsers) {
            return a_r(false, { reason: ERRORS.ROOM.FULL });
        }

        this.users.set(user.id, user);

        return a_r(true, {
            type: ROOM_ACTIONS.JOINED_ROOM,
            userId: user.id,
            room: this.toJson()
        });
    }


    leave(
        /** @type User */ // this shold probably be only id
        user
    ) {
        if (!this.users.has(user.id)) {
            return a_r(false, { reason: ERRORS.ROOM.USER_NOT_FOUND });
        }

        this.users.delete(user.id);

        return a_r(true, { type: ROOM_ACTIONS.LEFT_ROOM, userId: user.id, room: this.toJson() });
    }

    // Actions and Commands
    adminCommand(
        /** @type User */ // this shold probably be only id
        user,
        command, payload = {}
    ) {
        const type = ROOM_ACTIONS.ADMIN_CMD;

        if (user.id !== this.adminId) {
            return a_r(false, { type, command, userId: user.id, reason: ERRORS.ROOM.NOT_ADMIN });
        }


        switch (command) {
            case ROOM_ACTIONS.ADMIN_CMDS.IDENTIFY: {
                return a_r(true, { type, command });
            }
            default: {
                return a_r(false, { type, command, reason: ERRORS.ROOM.ADMIN_CMD_NOT_FOUND });
            }
        }

    }

    toJson() {
        let usersPairs = Array.from(this.users).map(e => [e[0], e[1].toJson()]);
        let users = [];
        let userMap = {};
        for (const [id, user] of usersPairs) {
            users.push(user);
            userMap[id] = user;
        }
        return {
            id: this.id,
            adminId: this.adminId,
            isReady: this.isReady(),
            users,
            userMap,
            game: this.game ? this.game.toJson() : null
        };
    }
}

module.exports = Room;