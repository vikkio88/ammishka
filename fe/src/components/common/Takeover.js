import cx from 'classnames';
import './styles/Takeover.css';

import { TAKEOVER_TYPES } from '../../enums';

const Takeover = ({ content, title, type = null }) => {
    const classNames = cx("Takeover-wrapper", Object.values(TAKEOVER_TYPES).includes(type) && type);
    return (
        <div className={classNames}>
            <div className="Takeover-content">
                {title && <h2>{title}</h2>}
                <h1>{content}</h1>
            </div>
        </div>
    );
};


export default Takeover;