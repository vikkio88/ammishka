import { useStoreon } from 'storeon/react';
import Test from './Test';

const Game = () => {
    const { game: { room }, app: { id } } = useStoreon('game', 'app');
    const isMyTurn = id === room.game.turns.order?.[0] || false;
    return (
        <>
            <h1>Base Sicilian Cards Game</h1>
            <h2>{isMyTurn ? 'YOUR TURN' : 'NOT YOUR TURN'}</h2>
            <h3>
                Phase : {room.game.phase.current}
            </h3>
            <h3>Possible actions</h3>
            {room.game.availableActions.map(a => <>{a}</>)}

            <h3>Deck info</h3>
            {room.game.deck.cardsLeft} / {room.game.deck.size}
            <pre>
                {JSON.stringify(room.game, null, 2)}
            </pre>
        </>
    );
};

export default Game;