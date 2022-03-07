import './styles/Hand.css';

const Hand = ({ secret, isMyTurn, selectCard }) => {
    const hasCardsInHand = Array.isArray(secret?.hand?.cards) && secret?.hand?.cards.length > 0;
    return (
        <>
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