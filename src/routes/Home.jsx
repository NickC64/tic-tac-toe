import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Home() {
    const navigate = useNavigate();
    
    const [playerX, setPlayerX] = useState({ type: 'human', name: 'Player 1', strategy: 'easy' });
    const [playerO, setPlayerO] = useState({ type: 'human', name: 'Player 2', strategy: 'easy' });

    function handleStartGame() {
        const params = new URLSearchParams();
        
        params.set('xType', playerX.type);
        params.set('xName', playerX.name);
        if (playerX.type === 'bot') {
            params.set('xStrategy', playerX.strategy);
        }
        
        params.set('oType', playerO.type);
        params.set('oName', playerO.name);
        if (playerO.type === 'bot') {
            params.set('oStrategy', playerO.strategy);
        }
        
        navigate(`/game?${params.toString()}`);
    }

    return (
        <main id="home-main">
            <h1>Welcome to Tic Tac Toe!</h1>
            <p>Configure your players and start a new game.</p>
            
            <div id="game-setup">
                <div className="player-setup">
                    <h2>Player X</h2>
                    <div className="setup-field">
                        <label>Type:</label>
                        <select 
                            value={playerX.type} 
                            onChange={(e) => setPlayerX({...playerX, type: e.target.value})}
                        >
                            <option value="human">Human</option>
                            <option value="bot">Bot</option>
                        </select>
                    </div>
                    <div className="setup-field">
                        <label>Name:</label>
                        <input 
                            type="text" 
                            value={playerX.name} 
                            onChange={(e) => setPlayerX({...playerX, name: e.target.value})}
                            placeholder="Player 1"
                        />
                    </div>
                    {playerX.type === 'bot' && (
                        <div className="setup-field">
                            <label>Difficulty:</label>
                            <select 
                                value={playerX.strategy} 
                                onChange={(e) => setPlayerX({...playerX, strategy: e.target.value})}
                            >
                                <option value="easy">Easy</option>
                                <option value="random">Random</option>
                                <option value="minimax">Unbeatable</option>
                            </select>
                        </div>
                    )}
                </div>

                <div className="player-setup">
                    <h2>Player O</h2>
                    <div className="setup-field">
                        <label>Type:</label>
                        <select 
                            value={playerO.type} 
                            onChange={(e) => setPlayerO({...playerO, type: e.target.value})}
                        >
                            <option value="human">Human</option>
                            <option value="bot">Bot</option>
                        </select>
                    </div>
                    <div className="setup-field">
                        <label>Name:</label>
                        <input 
                            type="text" 
                            value={playerO.name} 
                            onChange={(e) => setPlayerO({...playerO, name: e.target.value})}
                            placeholder="Player 2"
                        />
                    </div>
                    {playerO.type === 'bot' && (
                        <div className="setup-field">
                            <label>Difficulty:</label>
                            <select 
                                value={playerO.strategy} 
                                onChange={(e) => setPlayerO({...playerO, strategy: e.target.value})}
                            >
                                <option value="easy">Easy</option>
                                <option value="random">Random</option>
                                <option value="minimax">Unbeatable</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>

            <button onClick={handleStartGame} className="start-game-btn">Start Game</button>
        </main>
    );
}