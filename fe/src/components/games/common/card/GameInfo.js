import './styles/GameInfo.css';

const GameInfo = ({ phase, deck, isMyTurn }) => {
    return (
        <div className='GameInfo-wrapper'>
            <div>
                <h2>{isMyTurn ? 'YOUR TURN' : 'NOT YOUR TURN'}</h2>
                <h3>
                    Phase : {phase.current}
                </h3>
            </div>
            <div>
                <h3>Deck info</h3>
                {deck.cardsLeft} / {deck.size}
            </div>
        </div>
    );
};

export default GameInfo;