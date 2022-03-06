

const Debug = ({ secret, remoteGameState }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '12px' }}>
            <div>
                <h2>Secret State</h2>
                <pre>
                    {JSON.stringify(secret, null, 2)}
                </pre>
            </div>
            <div>
                <h2>Game State</h2>
                <pre>
                    {JSON.stringify(remoteGameState, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default Debug;