const GAME_ACTIONS = {
    CREATE_ROOM: 'client:create_room',
    CREATED_ROOM: 'server:created_room',

    JOIN_ROOM: 'client:join_room',
    JOINED_ROOM: 'client:joined_room',
    
    LEAVE_ROOM: 'client:leave_room',
    LEFT_ROOM: 'client:left_room',
};

module.exports = {
    GAME_ACTIONS
};