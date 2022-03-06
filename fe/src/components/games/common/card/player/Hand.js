import './styles/Hand.css';

const Hand = ({ secret, selectedCard, selectCard }) => {
    const hasCardsInHand = Array.isArray(secret?.hand?.cards) && secret?.hand?.cards.length > 0;
    return (
        <>
            <h3>Hand</h3>
            {!hasCardsInHand && <h4>Your Hand is empty</h4>}
            {hasCardsInHand && (
                <select onChange={e => selectCard(e.target.value)} defaultValue={selectedCard}>
                    {secret.hand.cards.map(c => <option key={c.id} value={c.id}>{`${c.value} ${c.seed}`}</option>)}
                </select>
            )}
        </>
    );
};

export default Hand;