import './styles/Toast.css';
import cx from 'classnames';

const Toast = ({ show = false, message }) => {
    const classNames = cx("Toast", show && 'show');
    return <div className={classNames}>{message}</div>;
};

export default Toast;