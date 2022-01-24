import { io } from "socket.io-client";
import { EVENTS, GAME_ACTIONS } from 'ammishka-shared/fe';
const { REACT_APP_BACKEND_URL } = process.env;
let client = null;

const timeoutPromise = (timeout = 3000) => new Promise((resolve) =>
    setTimeout(() => {
        console.log('mock timeout resolved');
        resolve();
    }, timeout)
);

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
        client.emit(EVENTS.ACTION, { type: GAME_ACTIONS.CREATE_ROOM });
    },
    async joinRoom() { return timeoutPromise(); },
    async leaveRoom() { return timeoutPromise(); },
    async action() {
        const client = await this.getClient();
        client.emit(EVENTS.ACTION, {
            type: 'test', stuff: 1
        });
    },
};



export default socket;