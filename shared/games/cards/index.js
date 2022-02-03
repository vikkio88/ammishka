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

const CARDS = {
    TYPES: CARD_TYPES,
    LABELS: {
        TYPES: LABEL_TYPES
    }
};

module.exports = {
    CARDS,
};