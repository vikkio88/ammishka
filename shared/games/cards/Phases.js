class Phases {
    constructor(phases = [], actions = {}) {
        this.phases = phases;
        this.actions = actions;
        this.pointer = 0;
        this.maxPointer = phases?.length || 0;
    }

    canDo(action) {
        return this.getActionsInCurrent().includes(action);
    }

    current() {
        return this.phases[this.pointer];
    }

    // null next phase means passing turn
    next() {
        const nextPointer = this.pointer + 1;
        if (nextPointer >= this.maxPointer) return null;
        return this.phases[nextPointer];
    }

    // null next phase means passing turn
    end() {
        const newPointer = this.pointer + 1;
        this.pointer = Math.min(this.maxPointer, newPointer);
        const endTurn = newPointer >= this.maxPointer;
        return { endTurn };
    }

    reset() {
        this.pointer = 0;
    }

    getActionsInCurrent() {
        const actions = this.actions[this.current()];
        if (!Array.isArray(actions)) return [];

        return actions;
    }

    toJson() {
        return {
            current: this.current(),
            next: this.next(),
            actionsInPhase: this.getActionsInCurrent(),
            all: this.phases,
            allActions: this.actions,
        };
    }
}

module.exports = Phases;