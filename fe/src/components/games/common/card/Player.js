import { useEffect, useState } from 'react';
import GameInfo from './GameInfo';
import a from 'store/actions';

const Player = ({ id, room, secret, dispatch }) => {
    const { phase, availableActions, deck, ...remoteGameState } = room.game;
    const hasCardsInHand = Array.isArray(secret?.hand?.cards) && secret?.hand?.cards.length > 0;
    const isMyTurn = id === room.game.turns.order?.[0] || false;
    const [action, setAction] = useState('');
    const [card, setCard] = useState(null);
    useEffect(() => {
        setAction(room.game.availableActions?.[0] || 'Nothing');
        setCard(secret?.hand?.cards?.[0] || 'Nothing');
    }, [room, secret]);
    return (
        <>
            <GameInfo {...{ phase, deck, isMyTurn }} />
            {isMyTurn && (
                <>
                    <h3>Possible actions</h3>
                    {availableActions.map(a => <span key={a}>{a}</span>)}

                    <select onChange={e => setAction(e.target.value)}>
                        {availableActions.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>

                    <button onClick={() => dispatch(a.GAME.ACTION, { action, payload: { cardId: card?.id } })}>{action}</button>
                </>)
            }


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
                    <h2>Game State</h2>
                    <pre>
                        {JSON.stringify(remoteGameState, null, 2)}
                    </pre>
                </div>
            </div>
        </>
    );
};

export default Player;