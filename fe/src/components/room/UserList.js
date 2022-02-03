import cx from 'classnames';
import './styles/UserList.css';

const UserList = ({ me, options, users, adminId, isAdmin, dispatch }) => {
    return (
        <div className='UserList-wrapper'>
            <h3>User List 👤</h3>
            <h2>{users.length} / {options.minUsers} (max: {options.maxUsers})</h2>
            <ul className='UserList'>
                {users.map(u => {
                    const liClasses = cx(me === u.id && 'userSelf');
                    return (
                        <li key={u.id} className={liClasses}>
                            <span className='userIcon'>
                                {u.id === adminId ? '👑' : '👤'}
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