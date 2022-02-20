const ACTIONS = {
    INIT: '@init',
    APP: {
        LOADING_START: 'app:loadingStart',
        LOADING_STOP: 'app:loadingStop',
        MERGE_STATE: 'app:mergeState',

        CONNECT: 'app:connect',
        CREATE: 'app:create',
        JOIN: 'app:join',
        LEAVE: 'app:leave',
    },
    // maybe rename this ROOM
    GAME: {
        TEST_ACTION: 'game:test:action',
        ACTION: 'game:action',
        ACTIONS: {
            ROOM_CREATED: 'game:room:created',
            ROOM_JOINED: 'game:room:joined',
            ROOM_LEFT: 'game:room:left',
        },
        ADMIN_CMD: 'game:room:admin_cmd',
        RCV_ADMIN_CMD: 'game:room:rcv_admin_cmd',

        SECRET_STATE_UPDATE: 'game:room:rcv_secret_state_update',
        STATE_UPDATE: 'game:room:rcv_state_update',
        GAME_STATE_UPDATE: 'game:room:rcv_game_state_update',
    },

    UI: {
        TAKEOVER: {
            SHOW: 'ui:takeover:show',
            HIDE: 'ui:takeover:hide',
        },
        NOTIFICATION: {
            SHOW: 'ui:notification:show',
            HIDE: 'ui:notification:hide',
        }
    },

    GAME_SETUP: {
        SET: 'game_setup:set',
        REMOVE_USER: 'game_setup:remove_user',
        ADD_PLAYER: 'game_setup:add_player',
        SET_PLAYERS: 'game_setup:set_players',
        ADD_NON_PLAYER: 'game_setup:add_non_player',
    },

    MISC: {
        IDENTIFY: 'misc:identify',
    }
};


export default ACTIONS;