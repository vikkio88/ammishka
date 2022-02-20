import { useEffect, useState } from 'react';
import { useStoreon } from 'storeon/react';
import a from '../../../store/actions';

import Test from './TestDnD';

const Game = () => {
    const { game: { room, secret }, app: { id }, dispatch } = useStoreon('game', 'app');
    const isMyTurn = id === room.game.turns.order?.[0] || false;

    const [action, setAction] = useState('');
    const [card, setCard] = useState(null);
    useEffect(() => {
        setAction(room.game.availableActions?.[0] || 'Nothing');
        setCard(secret?.hand?.cards?.[0] || 'Nothing');
    }, [room, secret]);


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

            <button onClick={() => dispatch(a.GAME.ACTION, { action, payload: { cardId: card?.id } })}>{action}</button>

            <h3>Deck info</h3>
            {room.game.deck.cardsLeft} / {room.game.deck.size}

            <h3>Hand</h3>
            <select onChange={e => setCard(e.target.value)} defaultValue={card}>
                {Array.isArray(secret?.hand?.cards) && secret.hand.cards.map(a => <option key={a.id} value={a.id}>{`${a.value} ${a.seed}`}</option>)}
            </select>

            <h2>Secret State</h2>
            <pre>
                {JSON.stringify(secret, null, 2)}
            </pre>

            <h2>Game State</h2>
            <pre>
                {JSON.stringify(room.game, null, 2)}
            </pre>
        </>
    );
};

export default Game;