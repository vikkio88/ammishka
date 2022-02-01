import { useState } from 'react';
import cx from 'classnames';
import { useStoreon } from 'storeon/react';
import a from '../../store/actions';
import { UserList, RoomActions, AdminActions } from '../game';
import './styles/Game.css';

const Game = () => {
    const [isNavHidden, setIsNavHidden] = useState(true);
    const toggleNav = () => setIsNavHidden(!isNavHidden);
    const navCx = cx({ 'hidden': isNavHidden });
    const showNavBtnCx = cx('tglNavButton', 'left', !isNavHidden && 'hidden');
    const { dispatch, game: { room, admin } } = useStoreon('game');
    const isAdmin = admin;
    return (
        <div className="Game-wrapper">
            <nav className={navCx}>
                <div className="room-commands">
                    {<RoomActions dispatch={dispatch} />}
                    {isAdmin && <AdminActions dispatch={dispatch} />}
                </div>
                <button className='tglNavButton' onClick={toggleNav}>👆</button>
                <input type="text" value={room.id} disabled style={{ textAlign: 'center' }} size={10} />
            </nav>
            <button onClick={toggleNav} className={showNavBtnCx}>👇</button>
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

export default Game;