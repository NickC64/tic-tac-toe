import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';

import Player from '../../components/Player.jsx';
import GameBoard from '../../components/GameBoard.jsx';
import Log from '../../components/Log.jsx';
import GameOver from '../../components/GameOver.jsx';

import { 
  deriveGameBoard, 
  deriveActivePlayer, 
  deriveWinner, 
  isValidMove, 
  makeMove, 
  isDraw 
} from '../../utils/gameLogic.js';

import { randomStrategy, minimaxStrategy, easyStrategy } from '../../bots/strategies/index.js';

// Default player configs
const DEFAULT_PLAYER_CONFIGS = {
  X: { symbol: 'X', name: 'Player 1', type: 'human' },
  O: { symbol: 'O', name: 'Player 2', type: 'human' }
};

// Strategy map
const STRATEGY_MAP = {
  random: randomStrategy,
  minimax: minimaxStrategy,
  easy: easyStrategy
};

export default function Game() {
  const [searchParams] = useSearchParams();
  
  // Initialize player configs from URL params or defaults
  const getInitialPlayerConfigs = () => {
    const configs = { ...DEFAULT_PLAYER_CONFIGS };
    
    // Parse URL params if present
    const xType = searchParams.get('xType') || 'human';
    const xName = searchParams.get('xName') || 'Player 1';
    const xStrategy = searchParams.get('xStrategy') || null;
    
    const oType = searchParams.get('oType') || 'human';
    const oName = searchParams.get('oName') || 'Player 2';
    const oStrategy = searchParams.get('oStrategy') || null;
    
    configs.X = {
      symbol: 'X',
      name: xName,
      type: xType,
      strategy: xStrategy ? STRATEGY_MAP[xStrategy] : null
    };
    
    configs.O = {
      symbol: 'O',
      name: oName,
      type: oType,
      strategy: oStrategy ? STRATEGY_MAP[oStrategy] : null
    };
    
    return configs;
  };

  const [playerConfigs, setPlayerConfigs] = useState(getInitialPlayerConfigs);
  const [gameTurns, setGameTurns] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(null);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  const gameBoard = deriveGameBoard(gameTurns, currentMoveIndex);
  const activePlayer = deriveActivePlayer(gameTurns, currentMoveIndex);
  const winnerResult = deriveWinner(gameBoard, playerConfigs);
  const winner = winnerResult?.winner;
  const winningCombination = winnerResult?.combination;
  const hasDraw = isDraw(gameTurns, winner);

  // Delay showing game over screen to let winning line draw
  useEffect(() => {
    if ((winner || hasDraw) && currentMoveIndex === null) {
      // Wait 1.5 seconds before showing game over
      const timer = setTimeout(() => {
        setShowGameOver(true);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setShowGameOver(false);
    }
  }, [winner, hasDraw, currentMoveIndex]);

  // Unified move handler
  function handleMove(square) {
    // Prevent moves when viewing past states
    if (currentMoveIndex !== null) {
      return;
    }

    // Prevent moves if game is over
    if (winner || hasDraw) {
      return;
    }

    // Validate move
    if (!isValidMove(gameBoard, square)) {
      return;
    }

    // Make the move
    setGameTurns((prevTurns) => {
      const currentPlayerSymbol = deriveActivePlayer(prevTurns, null);
      return makeMove(prevTurns, square, currentPlayerSymbol);
    });

    // Reset to latest state when making a new move
    setCurrentMoveIndex(null);
  }

  // Handle square click (for human players)
  function handleSelectSquare(rowIndex, colIndex) {
    // Don't allow moves if it's a bot's turn
    if (playerConfigs[activePlayer]?.type === 'bot') {
      return;
    }
    
    handleMove({ row: rowIndex, col: colIndex });
  }

  // Bot move triggering effect
  useEffect(() => {
    // Don't trigger bot moves when viewing past states
    if (currentMoveIndex !== null) {
      return;
    }

    // Don't trigger if game is over
    if (winner || hasDraw) {
      return;
    }

    const activePlayerConfig = playerConfigs[activePlayer];
    
    // Only trigger if active player is a bot
    if (activePlayerConfig?.type === 'bot' && activePlayerConfig?.strategy) {
      setIsBotThinking(true);
      
      // Add a small delay for better UX
      const timer = setTimeout(() => {
        const currentBoard = deriveGameBoard(gameTurns, null);
        const botMove = activePlayerConfig.strategy(currentBoard, activePlayer);
        if (botMove) {
          // Make the move directly
          setGameTurns((prevTurns) => {
            const currentPlayerSymbol = deriveActivePlayer(prevTurns, null);
            return makeMove(prevTurns, botMove, currentPlayerSymbol);
          });
          setCurrentMoveIndex(null);
        }
        setIsBotThinking(false);
      }, 500); // 500ms delay

      return () => clearTimeout(timer);
    } else {
      setIsBotThinking(false);
    }
  }, [gameTurns, activePlayer, currentMoveIndex, winner, hasDraw, playerConfigs]);

  function handleRestart() {
    setGameTurns([]);
    setCurrentMoveIndex(null);
    setIsBotThinking(false);
    setShowGameOver(false);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayerConfigs(prevConfigs => ({
      ...prevConfigs,
      [symbol]: { ...prevConfigs[symbol], name: newName }
    }));
  }

  function handleSelectMove(index) {
    // If clicking the latest move, return to current state (null)
    if (index === gameTurns.length - 1) {
      setCurrentMoveIndex(null);
    } else {
      setCurrentMoveIndex(index);
    }
  }

  function handleReturnToCurrent() {
    setCurrentMoveIndex(null);
  }

  const isViewingPast = currentMoveIndex !== null;
  const isBoardDisabled = isViewingPast || isBotThinking || playerConfigs[activePlayer]?.type === 'bot' || winner || hasDraw;

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

