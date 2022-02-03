import cx from 'classnames';
import './styles/UserList.css';

const UserList = ({ me, users, adminId, isAdmin, dispatch }) => {
    return (
        <div className='UserList-wrapper'>
            <h2>Users</h2>
            <ul className='UserList'>
                {users.map(u => {
                    const liClasses = cx(me === u.id && 'userSelf');
                    return (
                        <li key={u.id} className={liClasses}>
                            <span>
                                {u.id === adminId ? '👑 ' : '👤 '}
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