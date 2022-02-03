import { ROOM_ACTIONS } from 'ammishka-shared/fe';
import a from '../../store/actions';

const AdminActions = ({ dispatch }) => {
    return (
        <button
            onClick={() => dispatch(a.GAME.ADMIN_CMD, { command: ROOM_ACTIONS.ADMIN_CMDS.IDENTIFY })}
        >
            🙋
        </button>
    );
};

export default AdminActions;