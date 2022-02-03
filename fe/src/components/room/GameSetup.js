import './styles/GameSetup.css';
import { CARDS } from 'ammishka-shared/games';
import { useState } from 'react';

const GameSetup = ({ game, isAdmin }) => {
    const hasGame = Boolean(game);
    const types = Object.values(CARDS.TYPES);
    const [gameType, setGameType] = useState(types[0]);
    return (
        <div className="GameSetup-wrapper">
            <h3>Game 🎮</h3>

            {!hasGame && <h2>No game setup yet</h2>}
            {isAdmin && (
                <select
                    onChange={e => setGameType(e.target.value)}
                    value={gameType}
                >
                    {types.map(t => <option key={t} value={t}>{CARDS.LABELS.TYPES[t]}</option>)}
                </select>
            )}

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