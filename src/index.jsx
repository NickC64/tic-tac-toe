import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router";

import Game from './Game.jsx';
import './index.css';
import Home from "./Home.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/> }>
                <Route path="/game" element={<Game />} />
            </Route>
        </Routes>
    </BrowserRouter>
);
