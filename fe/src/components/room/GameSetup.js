import { useStoreon } from 'storeon/react';
import { CARDS } from 'ammishka-shared/games';
import { ROOM_ACTIONS } from 'ammishka-shared/fe';
import a from '../../store/actions';
import './styles/GameSetup.css';

const Turns = ({ isEditable = false, turns, setTurns = () => { } }) => {
    return (
        <>
            <h3>Turns</h3>
            <ul>
                {turns.map((p, index) => <TurnRow isEditable={isEditable} key={p.id} index={parseInt(index)} player={p} turns={turns} setTurns={setTurns} />)}
            </ul>
        </>
    );
};

const TurnRow = ({ isEditable, player, index, turns, setTurns }) => {
    const total = turns.length;
    const { id, name } = player;
    const insert = position => {
        const without = turns.filter(p => p.id !== id);
        const newTurns = [
            ...without.slice(0, position),
            player,
            ...without.slice(position)
        ];
        setTurns(newTurns);
    };
    return (
        <li>

            {(isEditable && index !== 0) && <button className='x-small' onClick={() => insert(index - 1)}>⬆️</button>}
            {(isEditable && index !== total - 1) && <button className='x-small' onClick={() => insert(index + 1)}  >⬇️</button>}
            {name}
        </li>
    );
};


const NonPlayers = ({ isEditable, list = [] }) => {
    //isEditable can be used to change type eventually

    return (
        <>
            <h3>Other Users</h3>
            {list.length < 1 && <>None</>}
            <ul>
                {list.map(u => <li key={u.id}>{u.name} {u.type}</li>)}
            </ul>
        </>
    );
};


const GameSetup = () => {
    const {
        dispatch,
        game: { room },
        app: { id: me },
        gameSetup
    } = useStoreon('game', 'gameSetup', 'app');
    const isAdmin = me === room.adminId; // maybe can only use game.admin 

    const hasGame = Boolean(room.game);
    const types = Object.values(CARDS.GAMES);
    return (
        <div className="GameSetup-wrapper">
            <h3>Game 🎮</h3>

            {!hasGame && <h2>No game setup yet</h2>}
            {(hasGame && !isAdmin) && (
                <>
                    <h2>{gameSetup.name}</h2>
                    <Turns turns={gameSetup.players} />
                    <NonPlayers list={gameSetup.nonPlayers} />
                </>
            )}

            {isAdmin && (
                <>
                    <select
                        onChange={e => dispatch(a.GAME_SETUP.SET({ type: e.target.value, isDirty: true }))}
                        value={gameSetup.type}
                    >
                        {types.map(t => <option key={t} value={t}>{CARDS.GAMES_CONFIG[t].label}</option>)}
                    </select>

                    <div>
                        <Turns isEditable={isAdmin} turns={gameSetup.players} setTurns={players => dispatch(a.GAME_SETUP.SET_PLAYERS, { players })} />
                        <NonPlayers isEditable={isAdmin} list={gameSetup.nonPlayers} />
                    </div>
                    <div>
                        <button
                            // maybe move this to the gameSetup module
                            onClick={() => dispatch(a.GAME.ADMIN_CMD, {
                                command: ROOM_ACTIONS.ADMIN_CMDS.SET_GAME,
                                payload: { game: null }
                            })}
                        >
                            RESET
                        </button>
                        <button
                            // maybe move this to the gameSetup module
                            onClick={() => dispatch(a.GAME.ADMIN_CMD, {
                                command: ROOM_ACTIONS.ADMIN_CMDS.SET_GAME,
                                payload: { game: gameSetup.type, users: [...gameSetup.players, ...gameSetup.nonPlayers] }
                            })}
                        >
                            SAVE
                        </button>
                    </div>
                </>
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