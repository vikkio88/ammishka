import { AB } from '../../wrappers';
import { STEPS } from './enums';
import './styles/Hand.css';

const Hand = ({ secret, isMyTurn, selectCard }) => {
    const hasCardsInHand = Array.isArray(secret?.hand?.cards) && secret?.hand?.cards.length > 0;
    return (
        <>
            {isMyTurn && <button className='accent small' onClick={() => selectCard(null, STEPS.ACTION_SELECT)}>← Back</button>}
            <h3>Hand</h3>
            {!hasCardsInHand && <h4>Your Hand is empty</h4>}
            <AB>
                {
                    hasCardsInHand && (
                        secret.hand.cards.map(c => (
                            <button
                                key={c.id}
                                disabled={!isMyTurn}
                                className='huge'
                                onClick={() => selectCard(c)}>
                                {`${c.value} ${c.seed}`}
                            </button>
                        )))
                }
            </AB>
        </>
    );
};

export default Hand;