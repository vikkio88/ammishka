const Game = require('./Game');

const getMockedGame = () => {
    return new Game();
};

describe('Game specs', () => {
    it('builds a Game', () => {
        const game = getMockedGame();
        expect(game).toBeInstanceOf(Game);
    });

    it('returns correctly whether a game is Ready', () => {
        const game = getMockedGame();
        expect(game.isReady()).toBe(false);
    });

});