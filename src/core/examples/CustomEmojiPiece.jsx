/**
 * Example: Custom Emoji Piece
 * Shows how to create a custom piece type using emojis
 */
import BasePiece from '../pieces/BasePiece.jsx';

const EMOJI_MAP = {
  'X': '❌',
  'O': '⭕',
};

export default function CustomEmojiPiece({ symbol, className, style }) {
  const emoji = EMOJI_MAP[symbol] || symbol;
  return (
    <span className={className} style={{ ...style, fontSize: '3rem' }}>
      {emoji}
    </span>
  );
}

// To use this:
// import pieceFactory from '../core/PieceFactory.js';
// import CustomEmojiPiece from './examples/CustomEmojiPiece.jsx';
// pieceFactory.register('emoji', CustomEmojiPiece);

