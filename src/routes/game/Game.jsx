import Player from '../../components/Player.jsx';
import GameBoard from '../../components/GameBoard.jsx';
import Log from '../../components/Log.jsx';
import GameOver from '../../components/GameOver.jsx';
import { useGameEngine } from '../../hooks/useGameEngine.js';

/**
 * Game View Component (MVVM Pattern)
 * Thin view layer that renders UI based on ViewModel state
 */
export default function Game() {
  // Get game state and actions from ViewModel
  const {
    playerConfigs,
    gameTurns,
    currentMoveIndex,
    isBotThinking,
    showGameOver,
    gameBoard,
    activePlayer,
    winner,
    winningCombination,
    hasDraw,
    isViewingPast,
    isBoardDisabled,
    handleSelectSquare,
    handleRestart,
    handlePlayerNameChange,
    handleSelectMove,
    handleReturnToCurrent,
  } = useGameEngine();

  return (
    <main id="game-main">
      <div id="game-wrapper">
        <div id="game-container">
          <ol id="players" className="highlight-player">
            <Player 
              initialName={playerConfigs.X.name} 
              symbol="X" 
              isActive={activePlayer === 'X'} 
              onChangeName={handlePlayerNameChange}
              isBot={playerConfigs.X.type === 'bot'}
            />
            <Player 
              initialName={playerConfigs.O.name} 
              symbol="O" 
              isActive={activePlayer === 'O'} 
              onChangeName={handlePlayerNameChange}
              isBot={playerConfigs.O.type === 'bot'}
            />
          </ol>
          {false}
          {showGameOver && <GameOver winner={winner} onRestart={handleRestart}/>}
          {isBotThinking && (
            <div className="bot-thinking-indicator">
              {playerConfigs[activePlayer]?.name} is thinking...
            </div>
          )}
          <GameBoard 
            onSelectSquare={handleSelectSquare} 
            board={gameBoard} 
            isViewingPast={isViewingPast}
            isDisabled={isBoardDisabled}
            winningCombination={winningCombination}
            hasDraw={hasDraw}
          />
        </div>
        {currentMoveIndex !== null && (
          <button onClick={handleReturnToCurrent} className="return-to-current-btn">
            Return to Current
          </button>
        )}
      </div>
      <Log turns={gameTurns} onSelectMove={handleSelectMove} currentMoveIndex={currentMoveIndex} />
    </main>
  )
}

