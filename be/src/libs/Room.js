class RoomsManager {
    constructor() {
        this.rooms = new Map();
        this.roomAdmins = new Map();
    }

    add(room) {
        this.rooms.set(room.id, room);
        this.roomAdmins.set(room.adminId, room.id);
    }

    join(roomId, userId) {
        if (!this.rooms.has(roomId)) {
            return false;
        }

        const room = this.rooms.get(roomId);

        return room.join(userId);
    }
}


class Room {
    constructor(id, admin) {
        this.id = id;
        this.adminId = admin.id;

        this.users = new Map();
        this.users.set(admin.id, admin);
    }

    join(userId) {

    }
}

module.exports = {
    Room,
    RoomsManager
};