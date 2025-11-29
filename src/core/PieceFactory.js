/**
 * Factory Pattern for creating board pieces
 * Allows easy extension with custom piece types
 */
import { TextPiece, IconPiece } from './pieces/index.js';

class PieceFactory {
  constructor() {
    this.pieceTypes = new Map();
    this.defaultType = 'text';
    
    // Register default piece types
    this.register('text', TextPiece);
    this.register('icon', IconPiece);
  }

  /**
   * Register a new piece type
   * @param {string} type - The type identifier
   * @param {React.Component} Component - The React component to render
   */
  register(type, Component) {
    this.pieceTypes.set(type, Component);
  }

  /**
   * Create a piece component
   * @param {string} type - The piece type
   * @param {object} props - Props to pass to the piece component
   * @returns {React.Component} The piece component
   */
  create(type, props) {
    const PieceComponent = this.pieceTypes.get(type) || this.pieceTypes.get(this.defaultType);
    if (!PieceComponent) {
      throw new Error(`No piece type registered for: ${type}`);
    }
    return PieceComponent;
  }

  /**
   * Get all registered piece types
   * @returns {string[]} Array of registered type names
   */
  getAvailableTypes() {
    return Array.from(this.pieceTypes.keys());
  }

  /**
   * Check if a piece type is registered
   * @param {string} type - The type to check
   * @returns {boolean}
   */
  hasType(type) {
    return this.pieceTypes.has(type);
  }
}

// Singleton instance
const pieceFactory = new PieceFactory();

export default pieceFactory;
export { PieceFactory };

