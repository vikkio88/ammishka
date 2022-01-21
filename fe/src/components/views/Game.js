import { useStoreon } from "storeon/react";

const Game = () => {
    const { dispatch } = useStoreon();
    return (
        <div>
            <h1>
                Game
            </h1>
            <button onClick={() => dispatch('game:action')}>ACTION</button>
        </div>
    );
};

export default Game;