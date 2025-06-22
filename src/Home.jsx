import {Outlet} from "react-router";

export default function Home() {

    return (
        <main>
        <h1>Welcome to Tic Tac Toe!</h1>
        <p>Click the button below to start a new game.</p>
        <button onClick={() => window.location.href = '/game'}>Start Game</button>
        <Outlet />
        </main>
    );
}