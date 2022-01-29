const { USER_TYPES } = require('ammishka-shared/types');

class User {

    constructor(id, type = USER_TYPES.PLAYER) {
        this.id = id;
        this.name = '';
        this.type = type;
    }

    static make({ id }, type = USER_TYPES.PLAYER) {
        return new User(id, type);
    }

    toJson() {
        return {
            id: this.id || null,
            name: this.name,
            type: this.type,
        };
    }
}

module.exports = User;