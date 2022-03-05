const Board = ({ board }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '12px' }}>
            <div>
                <h2>Board</h2>
                <pre>
                    {JSON.stringify(board, null, 2)}
                </pre>
            </div>
        </div>);
};

export default Board;