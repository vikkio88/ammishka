require('dotenv').config();
const { createServer } = require('http');
const { Server } = require('socket.io');
const httpServer = createServer();

const { REMOTE_HOST, LOCAL_PORT } = process.env;

const { GAME_ACTIONS } = require('ammishka-shared/actions');
const { EVENTS: e } = require('ammishka-shared/events');
const { RoomsManager } = require('./libs/Room');

const users = new Map();
const roomManager = new RoomsManager();



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

    socket.on(e.ACTION, ({ type, payload = {} } = {}) => {
        switch (type) {
            case GAME_ACTIONS.CREATE_ROOM: {
                const result = roomManager.make(socket);
                console.log(`room created ${result.payload.roomId}`);
                socket.emit(e.MESSAGE, result);
                
                // @TODO: Improve this using
                // joining room on socketio
                socket.join(result.payload.roomId);
                return;
            }
            case GAME_ACTIONS.JOIN_ROOM: {
                const { roomId } = payload;
                const result = roomManager.join(roomId, socket);
                console.log(`room joined`, result);
                socket.join(roomId);
                io.to(roomId).emit(e.MESSAGE, result);

                // broadcast to room
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
