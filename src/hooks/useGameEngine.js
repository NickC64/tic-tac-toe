import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import {
  deriveGameBoard,
  deriveActivePlayer,
  deriveWinner,
  isValidMove,
  makeMove,
  isDraw,
} from '../utils/gameLogic.js';
import { randomStrategy, minimaxStrategy, easyStrategy } from '../bots/strategies/index.js';
import eventBus, { GameEvents } from '../core/EventBus.js';

// Default player configs
const DEFAULT_PLAYER_CONFIGS = {
  X: { symbol: 'X', name: 'Player 1', type: 'human' },
  O: { symbol: 'O', name: 'Player 2', type: 'human' },
};

// Strategy map
const STRATEGY_MAP = {
  random: randomStrategy,
  minimax: minimaxStrategy,
  easy: easyStrategy,
};

/**
 * ViewModel hook for game engine
 * Manages all game state and business logic
 * @returns {object} Game state and actions
 */
export function useGameEngine() {
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
      strategy: xStrategy ? STRATEGY_MAP[xStrategy] : null,
    };

    configs.O = {
      symbol: 'O',
      name: oName,
      type: oType,
      strategy: oStrategy ? STRATEGY_MAP[oStrategy] : null,
    };

    return configs;
  };

  // Game state
  const [playerConfigs, setPlayerConfigs] = useState(getInitialPlayerConfigs);
  const [gameTurns, setGameTurns] = useState([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(null);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  // Derived state (computed from game state)
  const gameBoard = deriveGameBoard(gameTurns, currentMoveIndex);
  const activePlayer = deriveActivePlayer(gameTurns, currentMoveIndex);
  const winnerResult = deriveWinner(gameBoard, playerConfigs);
  const winner = winnerResult?.winner;
  const winningCombination = winnerResult?.combination;
  const hasDraw = isDraw(gameTurns, winner);
  const isViewingPast = currentMoveIndex !== null;
  const isBoardDisabled =
    isViewingPast ||
    isBotThinking ||
    playerConfigs[activePlayer]?.type === 'bot' ||
    winner ||
    hasDraw;

  // Handle game over state with delay
  useEffect(() => {
    if ((winner || hasDraw) && currentMoveIndex === null) {
      // Emit win or draw event
      if (winner) {
        eventBus.emit(GameEvents.WIN, { winner, playerConfigs });
      } else if (hasDraw) {
        eventBus.emit(GameEvents.DRAW, {});
      }

      // Wait 1.5 seconds before showing game over
      const timer = setTimeout(() => {
        setShowGameOver(true);
      }, 1500);

      return () => clearTimeout(timer);
    } else {
      setShowGameOver(false);
    }
  }, [winner, hasDraw, currentMoveIndex, playerConfigs]);

  // Unified move handler
  const handleMove = (square) => {
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

    // Emit square click event
    eventBus.emit(GameEvents.SQUARE_CLICK, { square, player: activePlayer });

    // Make the move
    setGameTurns((prevTurns) => {
      const currentPlayerSymbol = deriveActivePlayer(prevTurns, null);
      const newTurns = makeMove(prevTurns, square, currentPlayerSymbol);

      // Emit move event
      eventBus.emit(GameEvents.MOVE, {
        square,
        player: currentPlayerSymbol,
        moveIndex: newTurns.length - 1,
      });

      return newTurns;
    });

    // Reset to latest state when making a new move
    setCurrentMoveIndex(null);
  };

  // Handle square click (for human players)
  const handleSelectSquare = (rowIndex, colIndex) => {
    // Don't allow moves if it's a bot's turn
    if (playerConfigs[activePlayer]?.type === 'bot') {
      return;
    }

    handleMove({ row: rowIndex, col: colIndex });
  };

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
      eventBus.emit(GameEvents.BOT_THINKING, {
        player: activePlayer,
        name: activePlayerConfig.name,
      });

      // Add a small delay for better UX
      const timer = setTimeout(() => {
        const currentBoard = deriveGameBoard(gameTurns, null);
        const botMove = activePlayerConfig.strategy(currentBoard, activePlayer);
        if (botMove) {
          // Emit bot move event
          eventBus.emit(GameEvents.BOT_MOVE, {
            player: activePlayer,
            square: botMove,
          });

          // Make the move directly
          setGameTurns((prevTurns) => {
            const currentPlayerSymbol = deriveActivePlayer(prevTurns, null);
            const newTurns = makeMove(prevTurns, botMove, currentPlayerSymbol);

            // Emit move event
            eventBus.emit(GameEvents.MOVE, {
              square: botMove,
              player: currentPlayerSymbol,
              moveIndex: newTurns.length - 1,
              isBot: true,
            });

            return newTurns;
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

  // Game actions
  const handleRestart = () => {
    eventBus.emit(GameEvents.RESTART, {});
    setGameTurns([]);
    setCurrentMoveIndex(null);
    setIsBotThinking(false);
    setShowGameOver(false);
  };

  const handlePlayerNameChange = (symbol, newName) => {
    setPlayerConfigs((prevConfigs) => ({
      ...prevConfigs,
      [symbol]: { ...prevConfigs[symbol], name: newName },
    }));
  };

  const handleSelectMove = (index) => {
    // If clicking the latest move, return to current state (null)
    if (index === gameTurns.length - 1) {
      setCurrentMoveIndex(null);
    } else {
      setCurrentMoveIndex(index);
    }
  };

  const handleReturnToCurrent = () => {
    setCurrentMoveIndex(null);
  };

  // Return ViewModel interface
  return {
    // State
    playerConfigs,
    gameTurns,
    currentMoveIndex,
    isBotThinking,
    showGameOver,

    // Derived state
    gameBoard,
    activePlayer,
    winner,
    winningCombination,
    hasDraw,
    isViewingPast,
    isBoardDisabled,

    // Actions
    handleSelectSquare,
    handleRestart,
    handlePlayerNameChange,
    handleSelectMove,
    handleReturnToCurrent,
  };
}

