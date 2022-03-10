import { ACTIONS_CONFIG } from 'ammishka-shared/games/cards/CardGames';
import { AB } from '../../wrappers';
import { STEPS } from './enums';
import './styles/Actions.css';

const { actions: CARD_GAME_ACTIONS } = ACTIONS_CONFIG;

const nextStep = {
    [CARD_GAME_ACTIONS.PLAY_CARD]: STEPS.CARD_SELECT,
    [CARD_GAME_ACTIONS.END_TURN]: STEPS.FINAL,
};

const Actions = ({ availableActions, selectAction }) => {
    return (
        <AB>
            {availableActions.map(action => {
                const step = nextStep[action] || STEPS.FINAL;
                return (
                    <button
                        key={action}
                        className='huge'
                        onClick={
                            () => selectAction(action, step)
                        }
                    >
                        {action}
                    </button>
                );
            }
            )}

        </AB>
    );
};


export default Actions;