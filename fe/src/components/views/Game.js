import { useStoreon } from "storeon/react";
import a from "../../store/actions";

const Game = () => {
    const { dispatch, game: { room, admin } } = useStoreon('game');
    return (
        <div>
            <h1>
                Game
            </h1>
            <pre>
                {JSON.stringify({ room, admin }, null, 2)}
            </pre>
            <button onClick={() => dispatch('game:action')}>ACTION</button>
            <button className="accent" onClick={() => dispatch(a.APP.LEAVE)}>LEAVE</button>
        </div>
    );
};

export default Game;