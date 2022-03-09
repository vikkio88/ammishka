import { useStoreon } from 'storeon/react';
import { USER_TYPES } from 'ammishka-shared/types';
import { Player, Board } from '../common/card';

const Game = () => {
    const { game: { room, secret }, app: { id }, dispatch } = useStoreon('game', 'app');
    const playerProps = { id, room, secret };
    const amITheBoard = (room.game.nonPlayers || []).filter(p => p.id === id && p.type === USER_TYPES.BOARD).length > 0;
    return (
        <>
            <h1>Base Sicilian Cards Game</h1>
            {amITheBoard && <Board board={room.game.board} />}
            {!amITheBoard && <Player {...playerProps} dispatch={dispatch} />}
        </>
    );
};

export default Game;