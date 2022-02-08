import { useState } from 'react';
import { CARDS } from 'ammishka-shared/games';
import { ROOM_ACTIONS } from 'ammishka-shared/fe';
import a from '../../store/actions';
import './styles/GameSetup.css';

const GameSetup = ({ game, isAdmin, players, dispatch }) => {
    const hasGame = Boolean(game);
    const types = Object.values(CARDS.GAMES);
    const [gameType, setGameType] = useState(types[0]);
    return (
        <div className="GameSetup-wrapper">
            <h3>Game 🎮</h3>

            {!hasGame && <h2>No game setup yet</h2>}
            {isAdmin && (
                <>
                    <select
                        onChange={e => setGameType(e.target.value)}
                        value={gameType}
                    >
                        {types.map(t => <option key={t} value={t}>{CARDS.GAMES_CONFIG[t].label}</option>)}
                    </select>

                    <pre>
                        {JSON.stringify(players, null, 2)}
                    </pre>

                    <button
                        onClick={() => dispatch(a.GAME.ADMIN_CMD, {
                            command: ROOM_ACTIONS.ADMIN_CMDS.SET_GAME,
                            payload: { game: gameType, players }
                        })}
                    >
                        SAVE
                    </button>
                </>
            )}
            {(hasGame && !isAdmin) && <h2>{game.name}</h2>}

            {/* 
                set of options like if 
                the deck is shared or duplicated per player,
                slots on the table, if you need a common discard pile
                if you need players piles
                if there are roles to be applied to players 
                also stuff like turns and needs to be a form
                so you can apply and sends over to the rest 
                the game type
            */}
        </div>
    );
};

export default GameSetup;