const ACTIONS = {
    INIT: '@init',
    APP: {
        LOADING_START: 'app:loadingStart',
        LOADING_STOP: 'app:loadingStop',
        MERGE_STATE: 'app:mergeState',

        CONNECT: 'app:connect',
        CREATE: 'app:create',
        JOIN: 'app:join',
        JOINED: 'app:joined',
        LEAVE: 'app:leave',
        LEFT: 'app:left',
    },
    GAME: {
        ACTION: 'game:action',
        ACTIONS: {
            ROOM_CREATED: 'game:room:created',
        },

    },
};


export default ACTIONS;