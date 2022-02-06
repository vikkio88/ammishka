class Phases {
    constructor(phases, actions) {
        this.phases = phases;
        this.actions = actions;
        this.pointer = 0;
        this.maxPointer = phases.length;
    }

    current() {
        return this.phases[this.pointer];
    }

    end() {
        const newPointer = this.pointer + 1;
        this.pointer = Math.min(this.maxPointer, newPointer);
        const endTurn = newPointer > this.maxPointer;
        return { endTurn };
    }

    reset() {
        this.pointer = 0;
    }
}

module.exports = Phases;