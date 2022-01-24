const { Room, RoomsManager } = require("../../libs/Room");

const ROOM_ID = 'someRoomId';
const ADMIN_ID = 'someAdminId';

const userSocketMock = (id) => ({ id });
const getMockedRoom = () => {
    const user = userSocketMock(ADMIN_ID);
    return new Room(ROOM_ID, user);
};

describe('Room specs', () => {
    it('builds with room id and adminId', () => {
        const room = getMockedRoom();
        expect(room.id).toEqual(ROOM_ID);
        expect(room.adminId).toEqual(ADMIN_ID);
    });
});

describe('RoomsManager specs', () => {
    it('has empty maps to start with', () => {
        const rm = new RoomsManager();
        expect(rm.rooms.size).toBe(0);
        expect(rm.roomAdmins.size).toBe(0);
    });

    it('add a room correctly', () => {
        const room = getMockedRoom();

        const rm = new RoomsManager();

        rm.add(room);

        expect(rm.rooms.size).toBe(1);
        expect(rm.roomAdmins.size).toBe(1);

        expect(rm.roomAdmins.has(ADMIN_ID)).toBe(true);
    });

    it('make room will create one', () => {
        const fakeRoomIdGenerator = () => ROOM_ID;
        const rm = new RoomsManager(fakeRoomIdGenerator);

        const result = rm.make(userSocketMock(ADMIN_ID));

        expect(result).toEqual({ roomId: ROOM_ID });
        expect(rm.rooms.size).toBe(1);
        expect(rm.roomAdmins.size).toBe(1);

        expect(rm.rooms.has(ROOM_ID)).toBe(true);
        expect(rm.roomAdmins.has(ADMIN_ID)).toBe(true);
        expect(rm.roomAdmins.get(ADMIN_ID)).toBe(ROOM_ID);
    });
});