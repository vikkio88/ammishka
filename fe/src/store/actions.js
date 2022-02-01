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

    MISC: {
        IDENTIFY: 'misc:identify',
    }
};


export default ACTIONS;