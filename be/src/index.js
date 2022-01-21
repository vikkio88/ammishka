require('dotenv').config();
const { createServer } = require('http');
import { ulid } from 'ulid';
const { Server } = require('socket.io');
const httpServer = createServer();

const { REMOTE_HOST, LOCAL_PORT } = process.env;

const users = new Map();
const rooms = new Map();

const GAME_ACTIONS = {
    CREATE_ROOM: 'remote:create_room',
};

const io = new Server(httpServer, {
    cors: { origin: REMOTE_HOST, methods: ['GET', 'POST'] }
});

io.on('connection', socket => {
    const { client } = socket;
    const id = client.id;
    users.set(id, client);
    console.log('a user connected: ', id);
    console.log('users#: ', users.size);
    socket.on('disconnect', () => {
        users.delete(id);
        console.log('a user disconnected: ', id);
        console.log('users#: ', users.size);
    });

    socket.on('action', ({ type, payload: { } } = {}) => {
        switch (type) {
            case GAME_ACTIONS.CREATE_ROOM: {
                const roomId = ulid();
                // check what if the room admin leave?
                const room = { id: roomId, admin: id, users: [id], payload: { ...payload } };
                rooms.set(roomId, room);
                return;
            }
            default: {
                console.log(`${id}: `, { type, payload });
                return;
            }
        }
    });
});


httpServer.listen(LOCAL_PORT);
