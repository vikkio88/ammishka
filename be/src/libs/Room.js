const { ROOM_ACTIONS } = require('ammishka-shared/actions');
const { ERRORS } = require('ammishka-shared/errors');
const Game = require('ammishka-shared/games/Game');
const Deck = require('ammishka-shared/games/cards/Deck');
const { SingleDeckCardGame } = require('ammishka-shared/games/cards/CardGames');
const { actionResult: a_r } = require('ammishka-shared/payloads');

const User = require('./User');
const { CARDS } = require('ammishka-shared/games');

const defaultRoomOptions = {
    /** @type Number */
    maxUsers: 4,
    /** @type Number */
    minUsers: 2,

    /** @type String[] */
    availableGames: [CARDS.GAMES.BASE_SICILIAN]
};

const makeGame = (gameName, playersInOrder) => {

    const deck = Deck.makeFromConfig(
        CARDS.GAMES_CONFIG[CARDS.GAMES.BASE_SICILIAN].DECK.CONFIG
    );

    const game = new SingleDeckCardGame(deck, playersInOrder);
    game.setType(gameName);
    game.setName(CARDS.GAMES_CONFIG[CARDS.GAMES.BASE_SICILIAN].label);
    return game;
};


class Room {
    constructor(
        /** @type String */
        id,
        /** @type User */
        admin,
        options = {}
    ) {
        this.id = id;
        this.options = { ...defaultRoomOptions, ...options };
        this.adminId = admin.id;

        /** @type User[] */
        this.users = new Map();
        this.users.set(admin.id, admin);

        /**@type Game */
        this.game = null;
    }

    setGame(
        /**@type Game */
        game
    ) {
        this.game = game;
    }

    getGame() {
        return this.game;
    }

    isGameReady() {
        if (!this.game) return false;
        return this.game.isReady();
    }

    isEmpty() {
        return this.users.size === 0;
    }

    isReady() {
        return (this.users.size >= this.options.minUsers) && this.isGameReady();
    }

    hasPlayer(playerId) {
        return this.users.has(playerId);
    }

    join(
        /** @type User */
        user
    ) {
        if (this.users.size + 1 > this.options.maxUsers) {
            return a_r(false, { reason: ERRORS.ROOM.FULL });
        }

        this.users.set(user.id, user);

        return a_r(true, {
            type: ROOM_ACTIONS.JOINED_ROOM,
            userId: user.id,
            room: this.toJson()
        });
    }


    leave(
        /** @type User */ // this shold probably be only id
        user
    ) {
        if (!this.users.has(user.id)) {
            return a_r(false, { reason: ERRORS.ROOM.USER_NOT_FOUND });
        }

        this.users.delete(user.id);

        return a_r(true, { type: ROOM_ACTIONS.LEFT_ROOM, userId: user.id, room: this.toJson() });
    }

    // Actions and Commands
    adminCommand(
        /** @type User */ // this shold probably be only id
        user,
        command, payload = {}
    ) {
        const type = ROOM_ACTIONS.ADMIN_CMD;

        if (user.id !== this.adminId) {
            return a_r(false, { type, command, userId: user.id, reason: ERRORS.ROOM.NOT_ADMIN });
        }


        switch (command) {
            case ROOM_ACTIONS.ADMIN_CMDS.IDENTIFY: {
                return a_r(true, { type, command });
            }
            case ROOM_ACTIONS.ADMIN_CMDS.SET_GAME: {
                if (payload.game === null) {
                    this.setGame(null);
                    return a_r(true, { type: ROOM_ACTIONS.STATE_UPDATE, room: this.toJson() });
                }

                if (!this.options.availableGames.includes(payload.game)) {
                    return a_r(false, { type, command, userId: user.id, reason: ERRORS.ROOM.GAMES.NOT_FOUND });
                }
                const game = makeGame(payload.game, payload.users);
                this.setGame(game);
                return a_r(true, { type: ROOM_ACTIONS.STATE_UPDATE, room: this.toJson() });
            }
            case ROOM_ACTIONS.ADMIN_CMDS.START_GAME: {
                if (!Boolean(this.game)) {
                    return a_r(false, { type, command, userId: user.id, reason: ERRORS.ROOM.GAMES.NOT_FOUND });
                }
                this.game.start();
                return a_r(true, { type: ROOM_ACTIONS.STATE_UPDATE, room: this.toJson() });
            }
            case ROOM_ACTIONS.ADMIN_CMDS.STOP_GAME: {
                if (!Boolean(this.game)) {
                    return a_r(false, { type, command, userId: user.id, reason: ERRORS.ROOM.GAMES.NOT_FOUND });
                }
                this.game.stop();
                return a_r(true, { type: ROOM_ACTIONS.GAME_ACTIONS.STATE_UPDATE, game: room.getGame().toJson() });
            }
            default: {
                return a_r(false, { type, command, reason: ERRORS.ROOM.ADMIN_CMD_NOT_FOUND });
            }
        }

    }

    toJson() {
        let usersPairs = Array.from(this.users).map(e => [e[0], e[1].toJson()]);
        let users = [];
        let userMap = {};
        for (const [id, user] of usersPairs) {
            users.push(user);
            userMap[id] = user;
        }
        return {
            id: this.id,
            adminId: this.adminId,
            isReady: this.isReady(),
            options: { ...this.options },
            users,
            userMap,
            game: this.game ? this.game.toJson() : null
        };
    }
}

module.exports = Room;