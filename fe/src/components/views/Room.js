import React, { useState } from 'react';
import cx from 'classnames';
import { useStoreon } from 'storeon/react';
import a from '../../store/actions';
import { RoomInfo, RoomActions, AdminActions } from '../room';
import './styles/Room.css';
import getGameComponent from '../games';


const Room = () => {
    const [isNavHidden, setIsNavHidden] = useState(true);
    const toggleNav = () => setIsNavHidden(!isNavHidden);
    const navCx = cx({ 'hidden': isNavHidden });
    const showNavBtnCx = cx('tglNavButton', 'outer', !isNavHidden && 'hidden');
    const { dispatch, game: { admin: isAdmin, room } } = useStoreon('game');
    const hasGameStarted = room?.game?.hasStarted;
    // const GameComponent = React.lazy(() => import(`../games/${room?.game?.type}`));
    const GameComponent = getGameComponent(room?.game?.type);
    return (
        <div className="Room-wrapper">
            {/* Move nav to its own component */}
            <nav className={navCx}>
                <div className="room-commands">
                    {<RoomActions dispatch={dispatch} />}
                    {isAdmin && <AdminActions dispatch={dispatch} />}
                </div>
                <button className='tglNavButton' onClick={toggleNav}>❌</button>
            </nav>
            <button onClick={toggleNav} className={showNavBtnCx}>⚙️</button>
            {/* Move nav to its own component */}

            <section>
                <>
                    {!hasGameStarted && <RoomInfo />}
                    {hasGameStarted && (<GameComponent />)}
                </>
            </section>
            <footer>
                <button onClick={() => dispatch(a.GAME.TEST_ACTION)}>TEST ACTION</button>
            </footer>
        </div>
    );
};

export default Room;