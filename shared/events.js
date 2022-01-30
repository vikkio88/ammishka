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

    // Server -> All (maybe)
    NOTIFICATION: 'server:notification'
};

module.exports = {
    EVENTS
};