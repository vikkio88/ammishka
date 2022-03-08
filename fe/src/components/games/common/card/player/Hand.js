import { STEPS } from './enums';
import './styles/Hand.css';

const Hand = ({ secret, isMyTurn, panelState, selectCard, setPanelState }) => {
    const hasCardsInHand = Array.isArray(secret?.hand?.cards) && secret?.hand?.cards.length > 0;
    return (
        <>
            <button className='accent small' onClick={() => setPanelState({ ...panelState, step: STEPS.ACTION_SELECT })}>← Back</button>
            <h3>Hand</h3>
            {!hasCardsInHand && <h4>Your Hand is empty</h4>}
            {
                hasCardsInHand && (
                    secret.hand.cards.map(c => (
                        <button
                            key={c.id}
                            disabled={!isMyTurn}
                            onClick={() => selectCard(c)}>
                            {`${c.value} ${c.seed}`}
                        </button>
                    )))
            }
        </>
    );
};

export default Hand;