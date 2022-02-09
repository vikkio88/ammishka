import './styles/Version.css';
const { REACT_APP_VERSION } = process.env;

const Version = () => {
    return <div className="version">{REACT_APP_VERSION}</div>;
};

export default Version;