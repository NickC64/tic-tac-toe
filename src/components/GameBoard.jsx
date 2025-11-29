import { useGameConfig } from '../core/GameConfig.jsx';

export default function GameBoard( {onSelectSquare, board, isViewingPast, isDisabled, winningCombination, hasDraw} ) {
    const { getPieceComponent } = useGameConfig();
    // Calculate line coordinates for winning combination
    const getLineCoordinates = () => {
        if (!winningCombination || winningCombination.length !== 3) {
            return null;
        }

        // Get the board container dimensions (we'll use relative positioning)
        // Each square is 1/3 of the board width/height
        const squareSize = 100 / 3; // percentage
        
        // Get the first and last squares of the winning combination
        const first = winningCombination[0];
        const last = winningCombination[2];
        
        // Calculate center positions of first and last squares
        const centerX1 = (first.column + 0.5) * squareSize;
        const centerY1 = (first.row + 0.5) * squareSize;
        const centerX2 = (last.column + 0.5) * squareSize;
        const centerY2 = (last.row + 0.5) * squareSize;
        
        // Calculate direction vector
        const dx = centerX2 - centerX1;
        const dy = centerY2 - centerY1;
        
        // Extend the line by 15% on each end
        const extension = 0.15;
        const x1 = centerX1 - dx * extension;
        const y1 = centerY1 - dy * extension;
        const x2 = centerX2 + dx * extension;
        const y2 = centerY2 + dy * extension;
        
        return { x1, y1, x2, y2 };
    };

    const lineCoords = getLineCoordinates();

    // Check if a square is part of the winning combination
    const isWinningSquare = (rowIndex, colIndex) => {
        if (!winningCombination) return false;
        return winningCombination.some(
            square => square.row === rowIndex && square.column === colIndex
        );
    };

    return (
        <div style={{ position: 'relative', width: 'min(360px, 100%)', margin: '3rem auto' }}>
            <ol id="game-board">
                {board.map((row, rowIndex) =>
                    row.map((playerSymbol, colIndex) => {
                        const isWinner = isWinningSquare(rowIndex, colIndex);
                        return (
                            <li key={`${rowIndex}-${colIndex}`}>
                                <button
                                    onClick={() => onSelectSquare(rowIndex, colIndex)}
                                    disabled={playerSymbol !== null || isViewingPast || isDisabled}
                                    style={{ cursor: (isViewingPast || isDisabled) ? 'default' : playerSymbol !== null ? 'default' : 'pointer' }}
                                    className={`${isWinner ? 'winning-square' : ''} ${hasDraw ? 'draw-shake' : ''}`}
                                >
                                    {playerSymbol ? getPieceComponent(playerSymbol) : null}
                                </button>
                            </li>
                        );
                    })
                )}
            </ol>
            {lineCoords && (
                <svg 
                    className="winning-line" 
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 1
                    }}
                >
                    <line
                        x1={`${lineCoords.x1}%`}
                        y1={`${lineCoords.y1}%`}
                        x2={`${lineCoords.x2}%`}
                        y2={`${lineCoords.y2}%`}
                        stroke="var(--primary)"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />
                </svg>
            )}
        </div>
    );
}