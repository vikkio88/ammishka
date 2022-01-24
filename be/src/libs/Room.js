const { ERRORS } = require('ammishka-shared/errors');
const { ulid } = require('ulid');

const defaultRoomOptions = {
    maxUsers: 4,
    minUsers: 2,
};
class RoomsManager {
    constructor(idGenerator = ulid) {
        this.idGenerator = idGenerator;
        this.rooms = new Map();
        this.roomAdmins = new Map();
    }

    make(admin) {
        const id = this.idGenerator();
        this.add(new Room(id, admin));
        return { roomId: id };
    }

    add(room) {
        this.rooms.set(room.id, room);
        this.roomAdmins.set(room.adminId, room.id);
    }

    join(roomId, userId) {
        if (!this.rooms.has(roomId)) {
            return { success: false, reason: ERRORS.ROOM.NOT_FOUND };
        }

        const room = this.rooms.get(roomId);

        return room.join(userId);
    }
}


class Room {
    constructor(id, admin, options = defaultRoomOptions) {
        this.id = id;
        this.options = options;
        this.adminId = admin.id;

        this.users = new Map();
        this.users.set(admin.id, admin);
    }

    join(userId) {
        if (this.users.size +1 > this.options.maxUsers){
            return {success:false, reason: ERRORS.ROOM.FULL}
        }

    }
}

module.exports = {
    Room,
    RoomsManager
};