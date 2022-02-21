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


    const { phase, availableActions, deck, board, ...remoteGameState } = room.game;

    const hasCardsInHand = Array.isArray(secret?.hand?.cards) && secret?.hand?.cards.length > 0;


    return (
        <>
            <h1>Base Sicilian Cards Game</h1>
            <h2>{isMyTurn ? 'YOUR TURN' : 'NOT YOUR TURN'}</h2>
            <h3>
                Phase : {phase.current}
            </h3>
            <h3>Possible actions</h3>
            {availableActions.map(a => <span key={a}>{a}</span>)}

            <select onChange={e => setAction(e.target.value)}>
                {availableActions.map(a => <option key={a} value={a}>{a}</option>)}
            </select>

            <button onClick={() => dispatch(a.GAME.ACTION, { action, payload: { cardId: card?.id } })}>{action}</button>

            <h3>Deck info</h3>
            {deck.cardsLeft} / {deck.size}

            <h3>Hand</h3>
            {!hasCardsInHand && <h4>No cards in hand</h4>}
            {hasCardsInHand && (
                <select onChange={e => setCard(e.target.value)} defaultValue={card}>
                    {secret.hand.cards.map(c => <option key={c.id} value={c.id}>{`${c.value} ${c.seed}`}</option>)}
                </select>
            )}

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '12px' }}>
                <div>
                    <h2>Secret State</h2>
                    <pre>
                        {JSON.stringify(secret, null, 2)}
                    </pre>
                </div>

                <div>
                    <h2>Board State</h2>
                    <pre>
                        {JSON.stringify(board, null, 2)}
                    </pre>
                </div>

                <div>
                    <h2>Game State</h2>
                    <pre>
                        {JSON.stringify(remoteGameState, null, 2)}
                    </pre>
                </div>
            </div>
        </>
    );
};

export default Game;