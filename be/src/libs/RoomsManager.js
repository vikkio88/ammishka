const { ROOM_ACTIONS } = require('ammishka-shared/actions');
const { ERRORS } = require('ammishka-shared/errors');
const { generator } = require('ammishka-shared/libs/ammuzzu');
const { actionResult: a_r } = require('ammishka-shared/payloads');


const Room = require('./Room');
const User = require('./User');

class RoomsManager {
    constructor(idGenerator = generator.colourMoodCity) {
        this.idGenerator = idGenerator;
        /** @type Map<String, Room> */
        this.rooms = new Map();
        /** @type Map<String, String> */
        this.roomAdmins = new Map();
    }

    make(
        admin,
        options = {}
    ) {
        const id = this.idGenerator();
        const room = new Room(
            id,
            //TODO: maybe here I can flag if is admin
            User.make(admin),
            options
        );
        this.add(room);
        return a_r(true, {
            type: ROOM_ACTIONS.CREATED_ROOM,
            roomId: id,
            room: room.toJson()
        });
    }

    add(
        /** @type Room */
        room
    ) {
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


        return room.join(User.make(user));
    }

    leave(roomId, user) {
        if (!this.rooms.has(roomId)) {
            return a_r(false, { reason: ERRORS.ROOM.NOT_FOUND });
        }

        /** @type Room */
        const room = this.rooms.get(roomId);


        const result = room.leave(User.make(user));
        // here we might also check whether was the admin to leave
        if (result.success && room.isEmpty()) {
            this.rooms.delete(roomId);
        }

        return result;
    }

    getRoomforPlayerId(roomId, playerId) {
        if (!this.rooms.has(roomId)) {
            return a_r(false, { reason: ERRORS.ROOM.NOT_FOUND });
        }

        /** @type Room */
        const room = this.rooms.get(roomId);

        if (!room.hasPlayer(playerId)) {
            return a_r(false, { reason: ERRORS.ROOM.USER_NOT_FOUND });
        }

        // this is shit
        return { success: true, room };
    }

    adminCommand(user, roomId, command, commandPayload) {
        if (!this.rooms.has(roomId)) {
            return a_r(false, { reason: ERRORS.ROOM.NOT_FOUND });
        }

        /** @type Room */
        const room = this.rooms.get(roomId);


        return room.adminCommand(user, command, commandPayload);
    }
}

module.exports = RoomsManager;