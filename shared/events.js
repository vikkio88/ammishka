const EVENTS = {
    // Server
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',

    // Client
    CONNECT: 'connect',

    // Client -> Server
    ACTION: 'action',
    // Server -> Client
    MESSAGE: 'server:message',
};

module.exports = {
    EVENTS
};