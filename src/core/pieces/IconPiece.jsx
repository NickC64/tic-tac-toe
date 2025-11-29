import BasePiece from './BasePiece.jsx';

/**
 * Icon-based piece renderer
 * Supports custom images, icons, and emojis
 */
export default function IconPiece({ symbol, iconMap, imageMap, className, style }) {
  // Check if custom image is provided
  if (imageMap && imageMap[symbol]) {
    return (
      <img
        src={imageMap[symbol]}
        alt={symbol}
        className={className}
        style={{
          ...style,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block'
        }}
      />
    );
  }
  
  // Fall back to icon map or symbol
  const icon = iconMap?.[symbol] || symbol;
  return <BasePiece symbol={icon} className={className} style={style} />;
}

