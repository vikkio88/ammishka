import { io } from "socket.io-client";
import { EVENTS, ROOM_ACTIONS } from 'ammishka-shared/fe';
const { REACT_APP_BACKEND_URL } = process.env;
let client = null;

const registerEventHandler = (client, events = {}) => {
    for (const event of Object.keys(events)) {
        const handler = events[event];
        client.on(event, handler);
    }
};

const socket = {
    id: null,
    async init(events = {}) {
        if (client) return new Promise((resolve) => resolve(this));

        client = io(REACT_APP_BACKEND_URL);
        return new Promise((resolve, reject) => {
            try {
                registerEventHandler(client, events);
                client.on(EVENTS.CONNECT, () => {
                    const { id } = client;
                    this.id = id;
                    resolve(this);
                });
            } catch (error) {
                console.log(error);
                reject(error);
            }
        });
    },

    isReady() {
        return Boolean(this.id);
    },

    async getClient() {
        if (client) return client;

        await this.init();

        return client;
    },
    async createRoom() {
        const client = await this.getClient();
        client.emit(EVENTS.ACTION, { type: ROOM_ACTIONS.CREATE_ROOM });
    },
    async joinRoom(roomId) {
        const client = await this.getClient();
        client.emit(EVENTS.ACTION, { type: ROOM_ACTIONS.JOIN_ROOM, payload: { roomId } });
    },
    async leaveRoom(roomId) {
        const client = await this.getClient();
        client.emit(EVENTS.ACTION, { type: ROOM_ACTIONS.LEAVE_ROOM, payload: { roomId } });
    },
    async action() {
        const client = await this.getClient();
        client.emit(EVENTS.ACTION, {
            type: 'test', stuff: 1
        });
    },


    async disconnect() {
        const clientInstance = await this.getClient();
        clientInstance.disconnect();
        client = null;
        this.id = null;
    },
};



export default socket;