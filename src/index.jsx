import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";

import NavBar from "./routes/Navbar.jsx";
import Game from './routes/game/Game.jsx';
import './routes/game/game.scss';
import Home from "./routes/Home.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <NavBar />
        <Routes>
            <Route index element={<Home/> } />

            <Route path="/game" element={<Game />} />
        </Routes>
    </BrowserRouter>
);
