const CARD_TYPES = {
    FRENCH: 'french',
    SICILIAN: 'sicilian',
    ELEMENTAL: 'elemental',
};

const LABEL_TYPES = {
    [CARD_TYPES.FRENCH]: 'French Cards',
    [CARD_TYPES.SICILIAN]: 'Sicilian Cards',
    [CARD_TYPES.ELEMENTAL]: 'Elemental Cards',
};

const SEEDS_TYPES = {
    [CARD_TYPES.FRENCH]: {
        HEARTS: 'hearts',
        SPADES: 'spades',
        CLUBS: 'clubs',
        DIAMONDS: 'diamonds',
    },
    [CARD_TYPES.SICILIAN]: {
        DENARI: 'denari',
        SPADE: 'spade',
        MAZZE: 'mazze',
        COPPE: 'coppe',
    },
    [CARD_TYPES.ELEMENTAL]: {
        FIRE: 'fire',
        WATER: 'water',
        GRASS: 'grass',
        SAND: 'sand',
    },
};

const DECK_CONFIG = {
    [CARD_TYPES.FRENCH]: {
        seeds: {
            obj: SEEDS_TYPES[CARD_TYPES.FRENCH],
            array: Object.values(SEEDS_TYPES[CARD_TYPES.FRENCH])
        },
        size: {
            perSeed: [1, 13],
        },
        specialCards: [] // here to add jokers maybe
    },
    [CARD_TYPES.SICILIAN]: {
        seeds: {
            obj: SEEDS_TYPES[CARD_TYPES.SICILIAN],
            array: Object.values(SEEDS_TYPES[CARD_TYPES.SICILIAN])
        },
        size: {
            perSeed: [1, 10],
        }
    },
    [CARD_TYPES.ELEMENTAL]: {
        seeds: {
            obj: SEEDS_TYPES[CARD_TYPES.ELEMENTAL],
            array: Object.values(SEEDS_TYPES[CARD_TYPES.ELEMENTAL])
        },
        size: {
            perSeed: [1, 5],
        }
    },
};

const GAMES = {
    BASE_SICILIAN: 'base_sicilian_cards',
};

const CARDS = {
    TYPES: CARD_TYPES,
    LABELS: {
        TYPES: LABEL_TYPES
    },
    DECKS: {
        CONFIG: DECK_CONFIG,
    },
    GAMES,
    GAMES_CONFIG: {
        [GAMES.BASE_SICILIAN]: {
            DECK: { CONFIG: DECK_CONFIG[CARD_TYPES.SICILIAN] },
            label: 'Sicilian cards',
            sharedDeck: true,
            config: {
                minPlayers: 2,
                maxPlayers: 4,
            }
        }
    }
};

module.exports = {
    CARDS,
};