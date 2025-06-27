import { NavLink } from "react-router";
import { useState } from "react";
import "./navbar.scss";

export default function NavBar() {
    const [isLightTheme, setIsLightTheme] = useState(false);

    const handleThemeToggle = () => {
        setIsLightTheme((prevTheme) => !prevTheme);
        document.documentElement.classList.toggle("light-theme", !isLightTheme);
    };

    return (
        <nav className="navbar">
            <h1 className="navbar-title">Tic Tac Toe</h1>
            <ul className="navbar-links">
                <li>
                    <NavLink to={"/"} end>Home</NavLink>
                </li>
                <li>
                    <NavLink to={"/game"}>Game</NavLink>
                </li>
                <li>
                    <button id="theme-toggle" onClick={handleThemeToggle}>
                        Change Theme!
                    </button>
                </li>
            </ul>
        </nav>
    );
}