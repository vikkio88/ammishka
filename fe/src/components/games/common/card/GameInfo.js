import './styles/GameInfo.css';

const GameInfo = ({ phase, deck, isMyTurn }) => {
    return (
        <>
            <h2>{isMyTurn ? 'YOUR TURN' : 'NOT YOUR TURN'}</h2>
            <h3>
                Phase : {phase.current}
            </h3>
            <h3>Deck info</h3>
            {deck.cardsLeft} / {deck.size}
        </>
    );
};

export default GameInfo;