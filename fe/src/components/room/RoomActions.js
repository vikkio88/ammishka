import a from '../../store/actions';

const RoomActions = ({ dispatch }) => {
    return (
        <button
            className="accent"
            onClick={() => dispatch(a.APP.LEAVE)}
        >
             🚪🚶
        </button>
    );
};

export default RoomActions;