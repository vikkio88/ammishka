require('dotenv').config();
const { createServer } = require('http');
const { ulid } = require('ulid');
const { Server } = require('socket.io');
const httpServer = createServer();

const { REMOTE_HOST, LOCAL_PORT } = process.env;

const { GAME_ACTIONS } = require('ammishka-shared/actions');
const { EVENTS: e } = require('ammishka-shared/events');

const users = new Map();
const rooms = new Map();



const io = new Server(httpServer, {
    cors: { origin: REMOTE_HOST, methods: ['GET', 'POST'] }
});

io.on(e.CONNECTION, socket => {
    const { client } = socket;
    const id = client.id;
    users.set(id, client);
    console.log('a user connected: ', id);
    console.log('users#: ', users.size);
    socket.emit(e.MESSAGE, { yo: 1 });
    socket.on(e.DISCONNECT, () => {
        users.delete(id);
        console.log('a user disconnected: ', id);
        console.log('users#: ', users.size);
    });

    socket.on('action', ({ type, payload = {} } = {}) => {
        switch (type) {
            case GAME_ACTIONS.CREATE_ROOM: {
                const roomId = ulid();
                // check what if the room admin leave?
                const room = { id: roomId, admin: id, users: [id], payload: { ...payload } };
                rooms.set(roomId, room);
                console.log(`room created ${roomId}`);
                socket.emit(e.MESSAGE, { type: GAME_ACTIONS.CREATED_ROOM, payload: { roomId } });
                return;
            }
            default: {
                console.log(`${id}: `, { type, payload });
                socket.emit(e.MESSAGE, { received: true, type: type });
                return;
            }
        }
    });
});


httpServer.listen(LOCAL_PORT);
