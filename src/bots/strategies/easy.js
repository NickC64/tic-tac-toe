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
 * Easy bot strategy - makes occasional mistakes
 * @param {Array} gameBoard - 3x3 game board array
 * @param {string} playerSymbol - 'X' or 'O'
 * @returns {Object} {row, col} or null if no moves available
 */
export function easyStrategy(gameBoard, playerSymbol) {
  const availableMoves = getAvailableMoves(gameBoard);
  
  if (availableMoves.length === 0) {
    return null;
  }
  
  const opponent = playerSymbol === 'X' ? 'O' : 'X';
  
  // 70% chance to make a smart move, 30% chance to make a random move
  const shouldMakeSmartMove = Math.random() < 0.7;
  
  if (shouldMakeSmartMove) {
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
  }
  
  // Otherwise make a random move
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
}

