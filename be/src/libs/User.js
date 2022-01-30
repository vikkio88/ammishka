const { generator } = require('ammishka-shared/libs/ammuzzu');
const { USER_TYPES } = require('ammishka-shared/types');

class User {

    constructor(id, type = USER_TYPES.PLAYER) {
        this.id = id;
        this.name = generator.colourMoodAnimal();
        this.type = type;
    }

    static make({ id }, type = USER_TYPES.PLAYER) {
        return new User(id, type);
    }

    toString(){
        return `${this.id}`;
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