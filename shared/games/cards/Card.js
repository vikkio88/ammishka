class Card {
    constructor(value, seed, id = null) {
        this.id = id || `${seed}_${value}`;
        this.value = value;
        this.seed = seed;
    }

    toJson() {
        return {
            id: this.id,
            value: this.value,
            seed: this.seed
        };

    }

    static makeStack(seeds, valueRange = [1, 10]) {
        const [min, max] = Array.isArray(valueRange) ? valueRange : [1, valueRange];
        const cards = [];
        for (const seed of seeds) {
            for (let i = min; i <= max; i++) {
                cards.push(new Card(i, seed));
            }
        }

        return cards;
    }
}
module.exports = Card;