const ROOM_ACTIONS = {
    CREATE_ROOM: 'client:create_room',
    CREATED_ROOM: 'server:created_room',

    JOIN_ROOM: 'client:join_room',
    JOINED_ROOM: 'client:joined_room',

    LEAVE_ROOM: 'client:leave_room',
    LEFT_ROOM: 'client:left_room',

    ROOM_ACTION: 'client:room_action',

    ADMIN_CMD: 'admin:cmd',
    ADMIN_CMDS: {
        IDENTIFY: 'admin:cmd:identify',
    },


    // this is for test purposes, duh!
    TEST: 'test'
};

module.exports = {
    ROOM_ACTIONS
};