const { ROOM_ACTIONS } = require('ammishka-shared/actions');
const Room = require('../../libs/Room');
const User = require('../../libs/User');

const ROOM_ID = 'someRoomId';
const ADMIN_ID = 'someAdminId';

const userSocketMock = (id) => new User(id);
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

    it('parses to json correctly for Gameless room', () => {
        const room = getMockedRoom();

        expect(room.toJson()).toEqual({
            id: ROOM_ID,
            isReady: false,
            adminId: ADMIN_ID,
            users: expect.arrayContaining([
                expect.objectContaining({
                    id: ADMIN_ID,
                    name: expect.any(String),
                    type: expect.any(String)
                })
            ]),
            userMap: expect.objectContaining({
                [ADMIN_ID]: expect.objectContaining({
                    id: ADMIN_ID,
                    name: expect.any(String),
                    type: expect.any(String)
                })
            }),
            options: expect.objectContaining({
                maxUsers: expect.any(Number),
                minUsers: expect.any(Number),
            }),
            game: null
        });
    });

    it('shows correctly when the room is ready', () => {
        let room = getMockedRoom({ options: { minUsers: 1 } });
        expect(room.isReady()).toBe(true);
        room = getMockedRoom({ options: { minUsers: 5 } });
        expect(room.isReady()).toBe(false);
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
        expect(res.payload.room.users).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: ADMIN_ID,
                    name: expect.any(String),
                    type: expect.any(String)
                })
            ]));
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
            payload: {
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

        expect(room.users.has(OTHER_ID)).toBe(false);
    });

    it('reports correctly if the room is empty', () => {
        const room = getMockedRoom();
        expect(room.isEmpty()).toBe(false);
        room.leave(userSocketMock(ADMIN_ID));
        expect(room.isEmpty()).toBe(true);
    });

    it('reports error if you cannot leave the room', () => { });

    // might need to broadcast the room left message somewhere else
    //it('reports error if you cannot leave the room', () => {});

    it('destroys the room if the admin leave', () => { });


    it('allows admin to execute command', () => {
        const room = getMockedRoom();
        const result = room.adminCommand({ id: ADMIN_ID }, ROOM_ACTIONS.ADMIN_CMDS.IDENTIFY);
        expect(result).toEqual({
            success: true,
            payload: {
                command: expect.stringContaining('identify'),
                type: expect.stringContaining('admin:cmd')
            }
        });
    });

    it('rejects non admin to execute command', () => {
        const OTHER_ID = 'someOtherId';
        const room = getMockedRoom();
        const result = room.adminCommand({ id: OTHER_ID }, ROOM_ACTIONS.ADMIN_CMDS.IDENTIFY);
        expect(result).toEqual({
            success: false,
            payload: {
                command: expect.stringContaining('identify'),
                reason: expect.stringContaining('not_admin'),
                type: expect.stringContaining('admin:cmd'),
                userId: OTHER_ID
            }
        });
    });

    it('rejects wrong commands', () => {
        const room = getMockedRoom();
        const result = room.adminCommand({ id: ADMIN_ID }, 'someFakeCommand');
        expect(result).toEqual({
            success: false,
            payload: {
                command: expect.stringContaining('FakeCommand'),
                reason: expect.stringContaining('admin_cmd_not_found'),
                type: expect.stringContaining('admin:cmd'),
            }
        });
    });


});