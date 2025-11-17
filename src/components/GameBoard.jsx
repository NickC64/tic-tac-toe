
export default function GameBoard( {onSelectSquare, board, isViewingPast, isDisabled} ) {

    
    return (
    <ol id="game-board">
        {board.map((row, rowIndex) => (
            <li key={rowIndex}>
                <ol>
                    {row.map((playerSymbol, colIndex) => (
                    <li key={colIndex}>
                        <button 
                            onClick={() => onSelectSquare(rowIndex, colIndex)} 
                            disabled={playerSymbol !== null || isViewingPast || isDisabled}
                            style={{ cursor: (isViewingPast || isDisabled) ? 'default' : playerSymbol !== null ? 'default' : 'pointer' }}
                        >
                            {playerSymbol}
                        </button>
                    </li>
                    ))}
                </ol>
            </li>)
        )}
    </ol>);

}