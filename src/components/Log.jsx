export default function Log({ turns }) {

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

                        return (
                            <li key={`${row}-${col}-${index}`} className={index === turns.length - 1 ? 'latest-move' : ''}>
                                {index + 1}. {player} ({row},{col})
                            </li>
                        )
                    })}
                </ol>
            )}
        </div>
    )
}