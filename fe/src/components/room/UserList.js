import { useStoreon } from 'storeon/react';
import cx from 'classnames';
import a from '../../store/actions';
import './styles/UserList.css';

const UserList = () => {
    const {
        game: { room, admin: isAdmin },
        app: { id: me },
        gameSetup: { players, nonPlayers },
        dispatch } = useStoreon('game', 'app', 'gameSetup');
    const { adminId, users, options } = room;
    return (
        <div className='UserList-wrapper'>
            <h3>User List 👤</h3>
            <h2>{users.length} / {options.minUsers} (max: {options.maxUsers})</h2>
            <ul className='UserList'>
                {users.map(u => {
                    const liClasses = cx(me === u.id && 'userSelf');
                    const isPlayer = Boolean(players.find(p => p.id === u.id));
                    const isNonPlayer = Boolean(nonPlayers.find(np => np.id === u.id));
                    return (
                        <li key={u.id} className={liClasses}>
                            {isAdmin && (
                                <span className='listCommands'>
                                    {!(isPlayer || isNonPlayer) && <button onClick={() => dispatch(a.GAME_SETUP.ADD_PLAYER, { player: { ...u } })}>👤</button>}
                                    {!(isPlayer || isNonPlayer) && <button onClick={() => dispatch(a.GAME_SETUP.ADD_NON_PLAYER, { nonPlayer: { ...u } })}>🖥️</button>}
                                    {(isPlayer || isNonPlayer) && <button onClick={() => dispatch(a.GAME_SETUP.REMOVE_USER, { id: u.id })}>❌</button>}
                                </span>
                            )}
                            <span className='userIcon'>
                                {u.id === adminId ? '👑' : '👾'}
                            </span>
                            <span>
                                {u.name} {/* TODO: add type too */}
                            </span>

                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default UserList;