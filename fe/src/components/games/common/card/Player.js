import { useEffect, useState } from 'react';
import a from 'store/actions';

import { Actions, Hand } from './player';
import { STEPS } from './player/enums';
import GameInfo from './GameInfo';
import Debug from './Debug';

import './styles/Player.css';



const Player = ({ id, room, secret, dispatch }) => {
    const { phase, availableActions, deck, ...remoteGameState } = room.game;
    const isMyTurn = id === room.game.turns.order?.[0] || false;

    const [panelState, setPanelState] = useState({ selectedCard: null, step: STEPS.ACTION_SELECT, action: null });
    const { step, action, selectedCard } = panelState;
    const selectCard = selectedCard => setPanelState({ ...panelState, selectedCard, step: STEPS.BOARD_SELECT });
    useEffect(() => {
        setPanelState({ selectedCard: null, step: STEPS.ACTION_SELECT, action: null });
    }, [isMyTurn, phase]);
    const payload = Boolean(selectedCard) ? { cardId: selectedCard?.id } : {};

    return (
        <>
            <GameInfo {...{ phase, deck, isMyTurn }} />
            <div className='ActionsSteps-wrapper'>
                {!isMyTurn && <Hand secret={secret} isMyTurn={isMyTurn} />}
                {isMyTurn && (
                    <>
                        {step === STEPS.ACTION_SELECT && <Actions {...{ availableActions, panelState, setPanelState }} />}
                        {step === STEPS.CARD_SELECT && <Hand {...{ isMyTurn, secret, setPanelState, selectCard, panelState }} />}
                        {step === STEPS.BOARD_SELECT && (
                            <>
                                <button className='accent small' onClick={() => setPanelState({ ...panelState, step: STEPS.CARD_SELECT })}>← Back</button>
                                <button onClick={() => setPanelState({ ...panelState, selectedCard: null, step: STEPS.FINAL })}>FAKE Board Position Picker</button>
                            </>
                        )}
                        {step === STEPS.FINAL && <>
                            <button className='accent small' onClick={() => setPanelState({ ...panelState, selectedCard: null, step: STEPS.ACTION_SELECT })}>← Actions</button>
                            <button className='accent small' onClick={() => setPanelState({ ...panelState, step: STEPS.BOARD_SELECT })}>← Back</button>
                            <button onClick={() => dispatch(
                                a.GAME.ACTION,
                                { action, payload }
                            )}>
                                Confirm: {action} {selectedCard ? selectedCard.id : ''}
                            </button>
                        </>}
                    </>
                )}


            </div>
            {/* <Debug {...{ secret, remoteGameState }} /> */}
        </>
    );
};

export default Player;