import { useState } from 'react';
import { useStoreon } from 'storeon/react';
import a from '../../store/actions';
import './styles/Lobby.css';

const STATES = {
    CREATING: 'creating',
    JOINING: 'joining',
    NOTHING: 'nothing',
};


const GameCreation = () => {
    const { dispatch } = useStoreon();
    return (
        <div className='Lobby-subWrapper'>
            <button onClick={() => dispatch(a.APP.CREATE)}>Create Room 🎮</button>
        </div>
    );
};

const GameJoining = () => {
    const { dispatch } = useStoreon();
    const [roomId, setRoomId] = useState('');
    return (
        <div className='Lobby-subWrapper'>
            <input type="text" value={roomId} placeholder='Insert Room Id' onChange={e => setRoomId(e.target.value)} />
            <button onClick={() => dispatch(a.APP.JOIN, { roomId })} disabled={!Boolean(roomId)}>Join</button>
        </div>
    );
};

const Lobby = () => {
    const [state, setState] = useState(STATES.NOTHING);
    return (
        <div className="Lobby-wrapper">
            <h1>
                Lobby
            </h1>
            {state === STATES.NOTHING && (
                <>
                    <button className='primary' onClick={() => setState(STATES.CREATING)}>Create Room</button>
                    <button onClick={() => setState(STATES.JOINING)}>Join Room</button>
                </>
            )}

            {state !== STATES.NOTHING && <button className='accent small' onClick={() => setState(STATES.NOTHING)}>← Back</button>}
            {state === STATES.CREATING && (
                <GameCreation />
            )}
            {state === STATES.JOINING && (
                <GameJoining />
            )}

        </div>
    );
};

export default Lobby;