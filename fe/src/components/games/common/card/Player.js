import { useEffect, useState } from 'react';
import GameInfo from './GameInfo';
import Debug from './Debug';
import { Actions, Hand } from './player';

const Player = ({ id, room, secret, dispatch }) => {
    const { phase, availableActions, deck, ...remoteGameState } = room.game;

    const isMyTurn = id === room.game.turns.order?.[0] || false;
        const [card, setCard] = useState(null);

    useEffect(() => {
        setCard(secret?.hand?.cards?.[0] || 'Nothing');
    }, [room, secret]);
    return (
        <>
            <GameInfo {...{ phase, deck, isMyTurn }} />
            <Actions {...{ availableActions, isMyTurn, selectedCard: card, dispatch }} />
            <Hand secret={secret} selectedCard={card} selectCard={setCard} />
            <Debug {...{ secret, remoteGameState }} />
        </>
    );
};

export default Player;