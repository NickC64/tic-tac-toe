/**
 * Base class for all board pieces
 * Implements the Component pattern for rendering
 */
export default function BasePiece({ symbol, className, style }) {
  return (
    <span className={className} style={style}>
      {symbol}
    </span>
  );
}

