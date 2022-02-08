const ROOM_ACTIONS = {
    CREATE_ROOM: 'client:create_room',
    CREATED_ROOM: 'server:created_room',

    JOIN_ROOM: 'client:join_room',
    JOINED_ROOM: 'client:joined_room',

    LEAVE_ROOM: 'client:leave_room',
    LEFT_ROOM: 'client:left_room',

    STATE_UPDATE: 'server:room_state_udpate',
    
    ROOM_ACTION: 'client:room_action',
    
    GAME_ACTION: 'client:game_action',
    GAME_ACTIONS: {
        STATE_UPDATE: 'server:game_state_udpate',
        RESULT: 'server:client:game_actions:result'
    },

    ADMIN_CMD: 'admin:cmd',
    ADMIN_CMDS: {
        IDENTIFY: 'admin:cmd:identify',
        SET_GAME: 'admin:cmd:set_game',
        START_GAME: 'admin:cmd:start_game',
        END_GAME: 'admin:cmd:end_game',
    },


    // this is for test purposes, duh!
    TEST: 'test'
};

module.exports = {
    ROOM_ACTIONS
};