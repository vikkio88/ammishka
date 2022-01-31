const { ROOM_ACTIONS } = require('ammishka-shared/actions');
const Room = require('../../libs/Room');
const RoomsManager = require('../../libs/RoomsManager');

const ROOM_ID = 'someRoomId';
const ADMIN_ID = 'someAdminId';

const userSocketMock = (id) => ({ id });
const getMockedRoom = ({ options = {} } = {}) => {
    const user = userSocketMock(ADMIN_ID);
    return new Room(ROOM_ID, user, options);
};

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

        expect(result).toEqual({
            success: true, payload: {
                type: expect.stringContaining('left'),
                userId: OTHER_ID,
                room: expect.objectContaining({
                    adminId: ADMIN_ID,
                    id: ROOM_ID,
                    isReady: false,
                    users: expect.arrayContaining([
                        expect.objectContaining({
                            id: ADMIN_ID,
                            name: expect.any(String),
                            type: expect.any(String)
                        })
                    ]),
                })
            }
        });
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

    it('removes the room if the last user leaves the room empty', () => {
        const fakeRoomIdGenerator = () => ROOM_ID;
        const rm = new RoomsManager(fakeRoomIdGenerator);

        rm.make(userSocketMock(ADMIN_ID));
        const OTHER_ID = 'other_user';
        const other = userSocketMock(OTHER_ID);

        rm.join(ROOM_ID, other);
        let result = rm.leave(ROOM_ID, other);
        expect(result.success).toBe(true);

        expect(rm.rooms.has(ROOM_ID)).toBe(true);

        result = rm.leave(ROOM_ID, userSocketMock(ADMIN_ID));
        expect(result.success).toBe(true);
        expect(rm.rooms.has(ROOM_ID)).toBe(false);
    });

    // admin commands
    it('proxies admin command to room if room exists', () => {
        const fakeRoomIdGenerator = () => ROOM_ID;
        const rm = new RoomsManager(fakeRoomIdGenerator);

        rm.make(userSocketMock(ADMIN_ID));
        const result = rm.adminCommand({ id: ADMIN_ID }, ROOM_ID, ROOM_ACTIONS.ADMIN_CMDS.IDENTIFY);
        expect(result.success).toBe(true);
    });
    it('reject admin command to room if room does exists', () => {
        const fakeRoomIdGenerator = () => ROOM_ID;
        const rm = new RoomsManager(fakeRoomIdGenerator);

        rm.make(userSocketMock(ADMIN_ID));
        const result = rm.adminCommand({ id: ADMIN_ID }, 'notReallyARoom', ROOM_ACTIONS.ADMIN_CMDS.IDENTIFY);
        expect(result).toEqual({
            success: false,
            payload: {
                reason: expect.stringContaining('room_not_found')
            }
        });
    });
});