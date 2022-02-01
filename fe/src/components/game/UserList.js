import './styles/UserList.css';

const UserList = ({ users, adminId, isAdmin, dispatch }) => {
    return (
        <ul className='UserList'>
            {users.map(u => {
                return (
                    <li key={u.id}>
                        {u.id === adminId ? '👑 ' : '👤 '}{u.name} {/* TODO: add type too */}
                    </li>
                );
            })}
        </ul>
    );
};

export default UserList;