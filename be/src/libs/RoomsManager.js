const { GAME_ACTIONS } = require('ammishka-shared/actions');
const { ERRORS } = require('ammishka-shared/errors');
const { actionResult: a_r } = require('ammishka-shared/payloads');
const { ulid } = require('ulid');

const Room = require('./Room');

class RoomsManager {
    constructor(idGenerator = ulid) {
        this.idGenerator = idGenerator;
        /** @type Map<String, Room> */
        this.rooms = new Map();
        /** @type Map<String, String> */
        this.roomAdmins = new Map();
    }

    make(admin, options = {}) {
        const id = this.idGenerator();
        const room = new Room(id, admin, options);
        this.add(room);
        return a_r(true, {
            type: GAME_ACTIONS.CREATED_ROOM,
            roomId: id,
            room: room.toJson()
        });
    }

    add(room) {
        this.rooms.set(room.id, room);
        this.roomAdmins.set(room.adminId, room.id);
    }

    join(roomId, user) {
        if (!this.rooms.has(roomId)) {
            return a_r(false, { reason: ERRORS.ROOM.NOT_FOUND });
        }

        /** @TODO: Might want to check if the user is already on */

        /** @type Room */
        const room = this.rooms.get(roomId);


        return room.join(user);
    }

    leave(roomId, user) {
        if (!this.rooms.has(roomId)) {
            return a_r(false, { reason: ERRORS.ROOM.NOT_FOUND });
        }

        /** @type Room */
        const room = this.rooms.get(roomId);


        return room.leave(user);

    }
}

module.exports = RoomsManager;