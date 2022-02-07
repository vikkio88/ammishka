const Phases = require('./Phases');

describe('Phases specs', () => {

    it('builds correctly a Phases', () => {
        const phases = new Phases();
        expect(phases.toJson()).toEqual({
            actionsInPhase: [],
            all: [],
            allActions: {},
            current: undefined,
            next: null,
        });
    });


});