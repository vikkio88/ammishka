require('dotenv').config();
const { createServer } = require('http');
const { Server } = require('socket.io');
const { REMOTE_HOST, LOCAL_PORT, PORT, APP_VERSION } = process.env;
const requestListener = (req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(`${JSON.stringify({ version: APP_VERSION, remote: REMOTE_HOST })}`);
};
const httpServer = createServer(requestListener);



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
    // todo: standardise notification maker
    socket.emit(e.NOTIFICATION, { message: 'Welcome!' });
    socket.on(e.DISCONNECT, () => {
        users.delete(id);
        console.log('a user disconnected: ', id);
        console.log('users#: ', users.size);
    });

    const actionHandler = makeActionHandler(socket, io, roomManager);
    socket.on(e.ACTION, actionHandler);
});

console.log(`ammishka-server: app version ${APP_VERSION}`);
console.log(`ammishka-server: starting at port ${PORT || LOCAL_PORT}`);
console.log(`ammishka-server: CORS setup for ${REMOTE_HOST}`);
httpServer.listen(PORT || LOCAL_PORT);
