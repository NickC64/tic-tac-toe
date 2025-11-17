import { WINNING_COMBINATIONS } from '../winning-combinations.js';

const INITIAL_GAMEBOARD = [[null, null, null], [null, null, null], [null, null, null]];

/**
 * Derives the game board state from game turns
 * @param {Array} gameTurns - Array of turn objects {square: {row, col}, player: 'X'|'O'}
 * @param {number|null} moveIndex - Index of move to show, or null for latest
 * @returns {Array} 3x3 game board array
 */
export function deriveGameBoard(gameTurns, moveIndex) {
  const gameBoard = [...INITIAL_GAMEBOARD.map(innerArray => [...innerArray])];

  if (gameTurns.length === 0) {
    return gameBoard;
  }

  // If moveIndex is null, show all turns (latest state)
  const maxIndex = moveIndex === null ? gameTurns.length - 1 : moveIndex;
  
  // Ensure maxIndex is within bounds
  const safeMaxIndex = Math.min(maxIndex, gameTurns.length - 1);

  for (let i = 0; i <= safeMaxIndex; i++) {
    const turn = gameTurns[i];
    if (turn) {
      const { square, player } = turn;
      const {row, col} = square;
      gameBoard[row][col] = player;
    }
  }
  return gameBoard;
}

/**
 * Derives the active player based on game turns
 * @param {Array} gameTurns - Array of turn objects
 * @param {number|null} moveIndex - Index of move to check, or null for latest
 * @returns {string} 'X' or 'O'
 */
export function deriveActivePlayer(gameTurns, moveIndex) {
  let currentPlayer = 'X';

  if (gameTurns.length > 0) {
    // If viewing a specific move, use turns up to that move
    const relevantTurns = moveIndex === null 
      ? gameTurns 
      : gameTurns.slice(0, moveIndex + 1);
    
    if (relevantTurns.length > 0 && relevantTurns[relevantTurns.length - 1].player === 'X') {
      currentPlayer = 'O';
    }
  }
  return currentPlayer;
}

/**
 * Derives the winner from the game board
 * @param {Array} gameBoard - 3x3 game board array
 * @param {Object} players - Object mapping symbols to player names/configs
 * @returns {string|undefined} Winner name or undefined
 */
export function deriveWinner(gameBoard, players) {
  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const [firstSquareSymbol, secondSquareSymbol, thirdSquareSymbol] = combination.map(
      (symbol) => gameBoard[symbol.row][symbol.column]
    );

    if (
      firstSquareSymbol && 
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      // Handle both old format (string) and new format (object with name property)
      const winnerConfig = players[firstSquareSymbol];
      winner = typeof winnerConfig === 'string' ? winnerConfig : winnerConfig?.name;
    }
  }
  return winner;
}

/**
 * Checks if a move is valid
 * @param {Array} gameBoard - 3x3 game board array
 * @param {Object} square - {row, col}
 * @returns {boolean} True if move is valid
 */
export function isValidMove(gameBoard, square) {
  const { row, col } = square;
  if (row < 0 || row > 2 || col < 0 || col > 2) {
    return false;
  }
  return gameBoard[row][col] === null;
}

/**
 * Gets all available moves on the board
 * @param {Array} gameBoard - 3x3 game board array
 * @returns {Array} Array of {row, col} objects
 */
export function getAvailableMoves(gameBoard) {
  const moves = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (gameBoard[row][col] === null) {
        moves.push({ row, col });
      }
    }
  }
  return moves;
}

/**
 * Makes a move and returns the new game turns array
 * @param {Array} gameTurns - Current game turns
 * @param {Object} square - {row, col}
 * @param {string} player - 'X' or 'O'
 * @returns {Array} New game turns array
 */
export function makeMove(gameTurns, square, player) {
  return [...gameTurns, { square: { row: square.row, col: square.col }, player }];
}

/**
 * Checks if the game is a draw
 * @param {Array} gameTurns - Array of turn objects
 * @param {string|undefined} winner - Winner if any
 * @returns {boolean} True if game is a draw
 */
export function isDraw(gameTurns, winner) {
  return gameTurns.length === 9 && !winner;
}

