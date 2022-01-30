require('dotenv').config();
const { createServer } = require('http');
const { Server } = require('socket.io');
const httpServer = createServer();

const { REMOTE_HOST, LOCAL_PORT } = process.env;


const { EVENTS: e } = require('ammishka-shared/events');
const RoomsManager = require('./libs/RoomsManager');
const makeActionHandler = require('./actions');

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
    socket.emit(e.NOTIFICATION, { yo: 1 });
    socket.on(e.DISCONNECT, () => {
        users.delete(id);
        console.log('a user disconnected: ', id);
        console.log('users#: ', users.size);
    });

    const actionHandler = makeActionHandler(socket, io, roomManager);
    socket.on(e.ACTION, actionHandler);
});


httpServer.listen(LOCAL_PORT);
