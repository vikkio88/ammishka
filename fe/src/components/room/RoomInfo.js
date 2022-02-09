import { useStoreon } from 'storeon/react';
import UserList from './UserList';
import GameSetup from './GameSetup';

import './styles/RoomInfo.css';

const RoomInfo = () => {
    const { game: { room } } = useStoreon('game');
    return (
        <div className='RoomInfo-wrapper'>
            <h3>Room 📣</h3>
            <input
                type="text"
                className='roomName'
                onClick={e => e.target.select()}
                value={room.id}
                size={15}
                readOnly
            />
            <GameSetup />
            <UserList />
        </div>
    );
};
export default RoomInfo;