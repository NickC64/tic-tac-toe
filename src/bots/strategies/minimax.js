import { getAvailableMoves } from '../../utils/gameLogic.js';
import { WINNING_COMBINATIONS } from '../../winning-combinations.js';

/**
 * Helper to check if a symbol has won
 * @param {Array} board - 3x3 game board array
 * @param {string} symbol - 'X' or 'O'
 * @returns {boolean} True if symbol has won
 */
function hasWon(board, symbol) {
  for (const combination of WINNING_COMBINATIONS) {
    const [first, second, third] = combination.map(
      (pos) => board[pos.row][pos.column]
    );
    if (first === symbol && second === symbol && third === symbol) {
      return true;
    }
  }
  return false;
}

/**
 * Minimax bot strategy - perfect play (unbeatable)
 * @param {Array} gameBoard - 3x3 game board array
 * @param {string} playerSymbol - 'X' or 'O'
 * @returns {Object} {row, col} or null if no moves available
 */
export function minimaxStrategy(gameBoard, playerSymbol) {
  const availableMoves = getAvailableMoves(gameBoard);
  
  if (availableMoves.length === 0) {
    return null;
  }
  
  const opponent = playerSymbol === 'X' ? 'O' : 'X';
  
  // Try to find a winning move
  for (const move of availableMoves) {
    const testBoard = gameBoard.map(row => [...row]);
    testBoard[move.row][move.col] = playerSymbol;
    if (hasWon(testBoard, playerSymbol)) {
      return move;
    }
  }
  
  // Try to block opponent's winning move
  for (const move of availableMoves) {
    const testBoard = gameBoard.map(row => [...row]);
    testBoard[move.row][move.col] = opponent;
    if (hasWon(testBoard, opponent)) {
      return move;
    }
  }
  
  // Prefer center
  if (gameBoard[1][1] === null) {
    return { row: 1, col: 1 };
  }
  
  // Prefer corners
  const corners = [
    { row: 0, col: 0 },
    { row: 0, col: 2 },
    { row: 2, col: 0 },
    { row: 2, col: 2 }
  ];
  const availableCorners = corners.filter(corner => gameBoard[corner.row][corner.col] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }
  
  // Use minimax algorithm for remaining moves
  let bestMove = null;
  let bestScore = -Infinity;
  
  for (const move of availableMoves) {
    const testBoard = gameBoard.map(row => [...row]);
    testBoard[move.row][move.col] = playerSymbol;
    const score = minimax(testBoard, false, playerSymbol, opponent);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  
  return bestMove || availableMoves[0];
}

/**
 * Minimax algorithm helper
 * @param {Array} board - Current board state
 * @param {boolean} isMaximizing - True if maximizing player's turn
 * @param {string} player - Current player symbol
 * @param {string} opponent - Opponent symbol
 * @returns {number} Score for the position
 */
function minimax(board, isMaximizing, player, opponent) {
  if (hasWon(board, player)) {
    return 10;
  } else if (hasWon(board, opponent)) {
    return -10;
  }
  
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) {
    return 0; // Draw
  }
  
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of availableMoves) {
      const testBoard = board.map(row => [...row]);
      testBoard[move.row][move.col] = player;
      const score = minimax(testBoard, false, player, opponent);
      bestScore = Math.max(score, bestScore);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const move of availableMoves) {
      const testBoard = board.map(row => [...row]);
      testBoard[move.row][move.col] = opponent;
      const score = minimax(testBoard, true, player, opponent);
      bestScore = Math.min(score, bestScore);
    }
    return bestScore;
  }
}

