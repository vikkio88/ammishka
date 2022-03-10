import { useEffect, useState } from 'react';
import a from 'store/actions';

import { Actions, Hand } from './player';
import { STEPS } from './player/enums';
import GameInfo from './GameInfo';
import Debug from './Debug';

import './styles/Player.css';
import { AB } from '../wrappers';

const initialPanelState = { selectedCard: null, step: STEPS.ACTION_SELECT, action: null };

const Player = ({ id, room, secret, dispatch }) => {
    const { phase, availableActions, deck, ...remoteGameState } = room.game;
    const isMyTurn = id === room.game.turns.order?.[0] || false;

    const [panelState, setPanelState] = useState({ ...initialPanelState });
    const { step, action, selectedCard } = panelState;
    useEffect(() => {
        setPanelState({ ...initialPanelState });
    }, [isMyTurn, phase]);

    const selectCard = (selectedCard, step = STEPS.BOARD_SELECT) => setPanelState({ ...panelState, selectedCard, step });
    const selectAction = (action, step = STEPS.CARD_SELECT) => setPanelState({ ...panelState, action, step });
    const payload = Boolean(selectedCard) ? { cardId: selectedCard?.id } : {};

    return (
        <>
            <GameInfo {...{ phase, deck, isMyTurn }} />
            <div className='ActionsSteps-wrapper'>
                {!isMyTurn && <Hand secret={secret} isMyTurn={isMyTurn} />}
                {isMyTurn && (
                    <>
                        {step === STEPS.ACTION_SELECT && <Actions {...{ availableActions, selectAction }} />}
                        {step === STEPS.CARD_SELECT && <Hand {...{ isMyTurn, secret, selectCard }} />}
                        {step === STEPS.BOARD_SELECT && (
                            <>
                                <button className='accent small' onClick={() => setPanelState({ ...panelState, step: STEPS.CARD_SELECT })}>← Back</button>
                                <AB>
                                    <button onClick={() => setPanelState({ ...panelState, step: STEPS.FINAL })}>FAKE Board Position Picker</button>
                                </AB>
                            </>
                        )}
                        {step === STEPS.FINAL && <>
                            <button className='accent small' onClick={() => setPanelState({ ...panelState, selectedCard: null, step: STEPS.ACTION_SELECT })}>← Actions</button>
                            {Boolean(selectedCard) && <button className='accent small' onClick={() => setPanelState({ ...panelState, step: STEPS.BOARD_SELECT })}>← Back</button>}
                            <AB>
                                <button
                                    className='huge'
                                    onClick={() => dispatch(
                                        a.GAME.ACTION,
                                        { action, payload }
                                    )}>
                                    Confirm: {action} {selectedCard ? selectedCard.id : ''}
                                </button>
                            </AB>
                        </>}
                    </>
                )}


            </div>
            {/* <Debug {...{ secret, remoteGameState }} /> */}
        </>
    );
};

export default Player;