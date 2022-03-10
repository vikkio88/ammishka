import './styles/ActionButtons.css';

const ActionButtons = ({ children }) => {
    return (
        <div className='actionButtons'>
            {children}
        </div>
    );
};

export default ActionButtons;