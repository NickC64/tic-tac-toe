
export default function GameBoard( {onSelectSquare, board, isViewingPast, isDisabled} ) {
    return (
        <ol id="game-board">
            {board.map((row, rowIndex) =>
                row.map((playerSymbol, colIndex) => (
                    <li key={`${rowIndex}-${colIndex}`}>
                        <button
                            onClick={() => onSelectSquare(rowIndex, colIndex)}
                            disabled={playerSymbol !== null || isViewingPast || isDisabled}
                            style={{ cursor: (isViewingPast || isDisabled) ? 'default' : playerSymbol !== null ? 'default' : 'pointer' }}
                        >
                            {playerSymbol}
                        </button>
                    </li>
                ))
            )}
        </ol>
    );
}