import { useState } from 'react';
import cx from 'classnames';
import { useStoreon } from 'storeon/react';
import a from '../../store/actions';
import { UserList, RoomActions, AdminActions } from '../room';
import './styles/Room.css';

const Room = () => {
    const [isNavHidden, setIsNavHidden] = useState(true);
    const toggleNav = () => setIsNavHidden(!isNavHidden);
    const navCx = cx({ 'hidden': isNavHidden });
    const showNavBtnCx = cx('tglNavButton', 'outer', !isNavHidden && 'hidden');
    const { dispatch, game: { room, admin } } = useStoreon('game');
    const isAdmin = admin;
    return (
        <div className="Room-wrapper">
            {/* Move nav to its own component */}
            <nav className={navCx}>
                <div className="room-commands">
                    {<RoomActions dispatch={dispatch} />}
                    {isAdmin && <AdminActions dispatch={dispatch} />}
                </div>
                <input type="text" value={room.id} disabled style={{ textAlign: 'center', fontSize: '10px', padding: '1px' }} size={20} />
                <button className='tglNavButton' onClick={toggleNav}>❌</button>
            </nav>
            <button onClick={toggleNav} className={showNavBtnCx}>⚙️</button>
            {/* Move nav to its own component */}
            <section>
                <input type="text" value={room.game} disabled={!isAdmin} style={{ textAlign: 'center' }} size={10} placeholder="Game" />
                <UserList users={room.users} adminId={room.adminId} isAdmin={isAdmin} dispatch={dispatch} />
            </section>
            <footer>
                <button onClick={() => dispatch(a.GAME.TEST_ACTION)}>TEST ACTION</button>
            </footer>
        </div>
    );
};

export default Room;