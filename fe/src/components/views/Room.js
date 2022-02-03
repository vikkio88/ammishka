import { useState } from 'react';
import cx from 'classnames';
import { useStoreon } from 'storeon/react';
import a from '../../store/actions';
import { RoomInfo, RoomActions, AdminActions, GameSetup } from '../room';
import './styles/Room.css';

const Room = () => {
    const [isNavHidden, setIsNavHidden] = useState(true);
    const toggleNav = () => setIsNavHidden(!isNavHidden);
    const navCx = cx({ 'hidden': isNavHidden });
    const showNavBtnCx = cx('tglNavButton', 'outer', !isNavHidden && 'hidden');
    const { dispatch, game: { room, admin }, app: { id: me } } = useStoreon('game', 'app');
    const isAdmin = admin;
    return (
        <div className="Room-wrapper">

            {/* Move nav to its own component */}
            <nav className={navCx}>
                <div className="room-commands">
                    {<RoomActions dispatch={dispatch} />}
                    {isAdmin && <AdminActions dispatch={dispatch} />}
                </div>
                <input type="text" value={room.id} disabled style={{ textAlign: 'center', fontSize: '10px', padding: '1px' }} size={20} readOnly />
                <button className='tglNavButton' onClick={toggleNav}>❌</button>
            </nav>
            <button onClick={toggleNav} className={showNavBtnCx}>⚙️</button>
            {/* Move nav to its own component */}

            <section>
                <RoomInfo me={me} room={room} isAdmin={isAdmin} dispatch={dispatch} />
                <GameSetup />
            </section>
            <footer>
                <button onClick={() => dispatch(a.GAME.TEST_ACTION)}>TEST ACTION</button>
            </footer>
        </div>
    );
};

export default Room;