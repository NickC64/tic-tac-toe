export default function Log({ turns, onSelectMove, currentMoveIndex }) {

    function handleSelectMove(index) {
        onSelectMove(index);
    }

    const isViewingPast = currentMoveIndex !== null;

    return (
        <div className="move-log-pane">
            <h2 className="move-log-header">Move Log</h2>
            {turns.length === 0 ? (
                <p className="move-log-empty">No moves yet</p>
            ) : (
                <ol id="log">
                    {turns.map((turn, index) => {
                        const { square, player } = turn;
                        const { row, col } = square;
                        const isSelected = currentMoveIndex === index;
                        const isLatest = index === turns.length - 1;

                        return (
                            <li 
                                key={`${row}-${col}-${index}`} 
                                onClick={() => handleSelectMove(index)} 
                                className={isSelected ? 'selected-move' : isLatest && !isViewingPast ? 'latest-move' : ''}
                            >
                                {index + 1}. {player} ({row},{col})
                            </li>
                        )
                    })}
                </ol>
            )}
        </div>
    )
}