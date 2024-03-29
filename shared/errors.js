const ERRORS = {
    ROOM: {
        NOT_FOUND: 'error:room_not_found',
        FULL: 'error:room_full',
        USER_NOT_FOUND: 'error:room:user_not_found',
        NOT_ADMIN: 'error:room:not_admin',
        NOT_READY: 'error:room:not_ready',
        ADMIN_CMD_NOT_FOUND: 'error:room:admin_cmd_not_found',
        GAMES: {
            NOT_FOUND: 'error:room:game_not_found',
        }
    }
};

module.exports = {
    ERRORS
};