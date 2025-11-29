import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";

import NavBar from "./components/Navbar.jsx";
import Game from './routes/game/Game.jsx';
import './routes/game/game.scss';
import Home from "./routes/Home.jsx";
import Settings from './routes/settings/Settings.jsx';
import { GameConfigProvider } from './core/GameConfig.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <GameConfigProvider>
            <NavBar />
            <Routes>
                <Route index element={<Home/> } />

                <Route path="/game" element={<Game />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </GameConfigProvider>
    </BrowserRouter>
);
