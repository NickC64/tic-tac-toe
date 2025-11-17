import { useState } from 'react';

export default function Player({initialName, symbol, isActive, onChangeName, isBot}) {
    const [playerName, setPlayerName] = useState(initialName);
    const [ isEditing, setIsEditing ] = useState(false);

    function handleEditClick () {
        // Don't allow editing for bots
        if (isBot) {
            return;
        }
        
        setIsEditing((editing) => !editing);
        if (isEditing) {
            onChangeName(symbol, playerName);
        }
    }

    function handleChange(event) {
        setPlayerName(event.target.value);
    }

    return (
        <li className={isActive? 'active' : undefined}>
            <span className="player">
              {isEditing? <input type="text" required value={playerName} onChange={handleChange} /> : <span className="player-name">{playerName}</span>}
              <span className="player-symbol">{symbol}</span>
              {isBot && <span className="bot-indicator">🤖</span>}
            </span>
            {!isBot && <button onClick={handleEditClick}>{isEditing? 'Save' : 'Edit'}</button>}
        </li>
    );
}