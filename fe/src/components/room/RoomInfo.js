import UserList from './UserList';
import GameSetup from './GameSetup';

import './styles/RoomInfo.css';

const RoomInfo = ({ me, room, isAdmin, dispatch }) => {
    return (
        <div className='RoomInfo-wrapper'>
            <h3>Room 📣</h3>
            <input type="text" className='roomName' onClick={e => e.target.select()} value={room.id} size={15} readOnly/>
            <GameSetup game={room.game} isAdmin={isAdmin} />
            <UserList
                me={me}
                options={room.options}
                users={room.users}
                adminId={room.adminId}
                isAdmin={isAdmin}
                dispatch={dispatch}
            />
        </div>
    );
};
export default RoomInfo;