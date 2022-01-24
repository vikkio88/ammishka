const { Room, RoomsManager } = require("../../libs/Room");

const ROOM_ID = 'someRoomId';
const ADMIN_ID = 'someAdminId';

const userSocketMock = (id) => ({ id });
const getMockedRoom = ({ options = {} } = {}) => {
    const user = userSocketMock(ADMIN_ID);
    return new Room(ROOM_ID, user, options);
};

describe('Room specs', () => {
    it('builds with room id and adminId', () => {
        const room = getMockedRoom();
        expect(room.id).toEqual(ROOM_ID);
        expect(room.adminId).toEqual(ADMIN_ID);
    });

    it('parses to json correctly', () => {
        const room = getMockedRoom();

        expect(room.toJson()).toEqual({
            id: ROOM_ID,
            adminId: ADMIN_ID,
            users: [ADMIN_ID]
        });
    });

    it('joins correctly', () => {
        const OTHER_ID = 'some_user_id';
        const room = getMockedRoom();
        expect(room.id).toEqual(ROOM_ID);

        const res = room.join(userSocketMock(OTHER_ID));

        expect(res).toEqual({
            success: true,
            payload: {
                type: expect.stringContaining('joined'),
                room: room.toJson(),
                userId: OTHER_ID
            }
        });
        expect(res.payload.room.users).toEqual(expect.arrayContaining([OTHER_ID]));
    });

    it('does not join if max users reached', () => {
        const OTHER_ID = 'some_user_id';
        const room = getMockedRoom({ options: { maxUsers: 1 } });
        expect(room.id).toEqual(ROOM_ID);

        const res = room.join(userSocketMock(OTHER_ID));

        expect(res).toEqual({ success: false, payload: { reason: expect.stringContaining('full') } });
    });

    it('leave the room correctly', () => {
        const OTHER_ID = 'some_user_id';
        const room = getMockedRoom();
        expect(room.id).toEqual(ROOM_ID);

        const notAdmin = userSocketMock(OTHER_ID);

        room.join(notAdmin);

        const res = room.leave(notAdmin);
        expect(res).toEqual({
            success: true,
            payload: { type: expect.stringContaining('left'), userId: OTHER_ID }
        });

        expect(room.users.has(OTHER_ID)).toBe(false);
    });
    it('reports error if you cannot leave the room', () => { });

    // might need to broadcast the room left message somewhere else
    //it('reports error if you cannot leave the room', () => {});

    it('destroys the room if the admin leave', () => { });


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

        expect(result).toEqual({
            success: true, payload: {
                type: expect.stringContaining('created'),
                roomId: ROOM_ID,
                room: expect.anything() /** @TODO: make this better */
            }
        });
        expect(rm.rooms.size).toBe(1);
        expect(rm.roomAdmins.size).toBe(1);

        expect(rm.rooms.has(ROOM_ID)).toBe(true);
        expect(rm.roomAdmins.has(ADMIN_ID)).toBe(true);
        expect(rm.roomAdmins.get(ADMIN_ID)).toBe(ROOM_ID);
    });

    it('joins a room correctly', () => {
        const fakeRoomIdGenerator = () => ROOM_ID;
        const rm = new RoomsManager(fakeRoomIdGenerator);

        rm.make(userSocketMock(ADMIN_ID));
        const OTHER_ID = 'other_user';
        const other = userSocketMock(OTHER_ID);

        const result = rm.join(ROOM_ID, other);

        expect(result).toEqual({
            success: true,
            payload: {
                type: expect.stringContaining('joined'),
                room: rm.rooms.get(ROOM_ID).toJson(),
                userId: OTHER_ID
            }
        });
    });

    it('does not join a room if the room does not exist', () => {
        const fakeRoomIdGenerator = () => ROOM_ID;
        const rm = new RoomsManager(fakeRoomIdGenerator);

        rm.make(userSocketMock(ADMIN_ID));
        const OTHER_ID = 'other_user';
        const other = userSocketMock(OTHER_ID);

        const result = rm.join('some room', other);

        expect(result).toEqual({ success: false, payload: { reason: expect.stringContaining('not_found') } });
    });

    it('leaves a room correctly', () => {
        const fakeRoomIdGenerator = () => ROOM_ID;
        const rm = new RoomsManager(fakeRoomIdGenerator);

        rm.make(userSocketMock(ADMIN_ID));
        const OTHER_ID = 'other_user';
        const other = userSocketMock(OTHER_ID);

        rm.join(ROOM_ID, other);
        const result = rm.leave(ROOM_ID, other);

        expect(result).toEqual({ success: true, payload: { type: expect.stringContaining('left'), userId: OTHER_ID } });
    });

    it('does not leave a room if the room does not exist', () => {
        const fakeRoomIdGenerator = () => ROOM_ID;
        const rm = new RoomsManager(fakeRoomIdGenerator);

        rm.make(userSocketMock(ADMIN_ID));
        const OTHER_ID = 'other_user';
        const other = userSocketMock(OTHER_ID);

        rm.join(ROOM_ID, other);
        const result = rm.leave('another room', other);
        expect(result).toEqual({ success: false, payload: { reason: expect.stringContaining('not_found') } });
    });
});