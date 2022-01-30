const names = require('./names.json');

const ammuzzu = {
    pickOne(array) {
        if (!Array.isArray(array)) return null;
        return array[ammuzzu.int(0, array.length - 1)];
    },
    int(low, high) {
        if (low > high) {
            const a = low;
            low = high;
            high = a;
        }
        return Math.round(Math.random() * (high - low) + low);
    },
    chance(percentage) {
        percentage = isNaN(percentage) ? 0 : percentage;
        percentage = Math.max(0, Math.min(100, percentage));
        return ammuzzu.int(0, 99) < percentage;
    },
    dice(faces = 6) {
        if (faces < 2) faces = 2;
        return ammuzzu.int(1, faces);
    }
};

const generator = {
    animal() {
        return ammuzzu.pickOne(names.animals);
    },
    colour() {
        return ammuzzu.pickOne(names.colours);
    },
    room() {
        return ammuzzu.pickOne(names.rooms);
    },
    mood() {
        return ammuzzu.pickOne(names.moods);
    },

    suffix() {
        const l1 = ammuzzu.pickOne(names.letters.split(''));
        const l2 = ammuzzu.pickOne(names.letters.split(''));
        const l3 = ammuzzu.pickOne(names.letters.split(''));
        return `_${l1}${l2}${l3}${ammuzzu.int(100, 999)}`;
    },

    colourAnimal(addSuffix = false) {
        const animal = generator.animal();
        const colour = generator.colour();
        let suffix = '';
        if (addSuffix) suffix = generator.suffix();
        return `${colour}_${animal}${suffix}`;
    },

    colourMoodAnimal() {
        const animal = generator.animal();
        const colour = generator.colour();
        const mood = generator.mood();
        return `${colour}_${mood}_${animal}`;
    },

    colourMoodRoom() {
        const room = generator.room();
        const colour = generator.colour();
        const mood = generator.mood();
        return `${colour}_${mood}_${room}`;
    }


};

module.exports = {
    ammuzzu, generator
};