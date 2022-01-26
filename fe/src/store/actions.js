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
        ACTION: 'game:action',
        ACTIONS: {
            ROOM_CREATED: 'game:room:created',
            ROOM_JOINED: 'game:room:joined',
            ROOM_LEFT: 'game:room:left',
        },

    },
};


export default ACTIONS;