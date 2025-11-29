import BasePiece from './BasePiece.jsx';

/**
 * Simple text-based piece renderer (default X, O)
 */
export default function TextPiece({ symbol, className, style }) {
  return <BasePiece symbol={symbol} className={className} style={style} />;
}

