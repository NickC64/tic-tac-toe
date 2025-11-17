import { getAvailableMoves } from '../../utils/gameLogic.js';

/**
 * Random bot strategy - makes a random valid move
 * @param {Array} gameBoard - 3x3 game board array
 * @param {string} playerSymbol - 'X' or 'O' (not used in random strategy)
 * @returns {Object} {row, col} or null if no moves available
 */
export function randomStrategy(gameBoard, playerSymbol) {
  const availableMoves = getAvailableMoves(gameBoard);
  
  if (availableMoves.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
}

