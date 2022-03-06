import a from 'store/actions';
import './styles/Actions.css';

const Actions = ({ isMyTurn, availableActions, dispatch, selectedCard }) => {
    return (
        <>
            {isMyTurn && (
                <div className='actionsButtons'>
                    {availableActions.map(action => (
                        <button
                            key={action}
                            onClick={
                                () => dispatch(
                                    a.GAME.ACTION,
                                    { action, payload: { cardId: selectedCard?.id } }
                                )
                            }
                        >
                            {action}
                        </button>
                    )
                    )}

                </div>
            )}
        </>
    );
};

export default Actions;