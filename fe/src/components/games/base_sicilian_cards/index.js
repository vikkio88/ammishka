import { useState } from 'react';
import { useStoreon } from 'storeon/react';
import a from '../../../store/actions';

import Test from './TestDnD';

const Game = () => {
    const { game: { room }, app: { id }, dispatch } = useStoreon('game', 'app');
    const isMyTurn = id === room.game.turns.order?.[0] || false;

    const [action, setAction] = useState(room.game.availableActions?.[0] || 'Nothing');

    return (
        <>
            <h1>Base Sicilian Cards Game</h1>
            <h2>{isMyTurn ? 'YOUR TURN' : 'NOT YOUR TURN'}</h2>
            <h3>
                Phase : {room.game.phase.current}
            </h3>
            <h3>Possible actions</h3>
            {room.game.availableActions.map(a => <span key={a}>{a}</span>)}

            <select onChange={e => setAction(e.target.value)}>
                {room.game.availableActions.map(a => <option key={a} value={a}>{a}</option>)}
            </select>

            <button onClick={() => dispatch(a.GAME.ACTION, { action, payload: {} })}>{action}</button>

            <h3>Deck info</h3>
            {room.game.deck.cardsLeft} / {room.game.deck.size}
            <pre>
                {JSON.stringify(room.game, null, 2)}
            </pre>
        </>
    );
};

export default Game;