import { NavLink } from "react-router";
import { useState, useEffect } from "react";
import "../routes/navbar.scss";
import { useGameConfig } from '../core/GameConfig.jsx';

export default function NavBar() {
    const { theme, toggleTheme, getIsLightMode } = useGameConfig();
    const [isLightTheme, setIsLightTheme] = useState(false);

    useEffect(() => {
        // Get current light mode state, with fallback for backward compatibility
        const isLight = getIsLightMode ? getIsLightMode() : theme === 'light';
        setIsLightTheme(isLight);
    }, [theme, getIsLightMode]);

    const handleThemeToggle = () => {
        toggleTheme();
    };

    // Show light theme icon (sun) when in dark mode, dark theme icon (moon) when in light mode
    const LightThemeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor" className="theme-icon">
            <path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652 140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114 114Zm283-100q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q66 0 113-47t47-113q0-66-47-113t-113-47q-66 0-113 47t-47 113q0 66 47 113t113 47Zm0-160Z"/>
        </svg>
    );

    const DarkThemeIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor" className="theme-icon">
            <path d="M484-80q-84 0-157.5-32t-128-86.5Q144-253 112-326.5T80-484q0-146 93-257.5T410-880q-18 99 11 193.5T521-521q71 71 165.5 100T880-410q-26 144-138 237T484-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T464-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T160-484q0 135 94.5 229.5T484-160Zm-20-305Z"/>
        </svg>
    );

    return (
        <nav className="navbar">
            <h1 className="navbar-title"><a className="navbar-title-link" href="/">Tic Tac Toe</a></h1>
            <ul className="navbar-links">
                <li>
                    <NavLink to={"/"} end>Home</NavLink>
                </li>
                <li>
                    <NavLink to={"/game"}>Game</NavLink>
                </li>
                <li>
                    <NavLink to={"/settings"}>Settings</NavLink>
                </li>
                <li>
                    <button id="theme-toggle" onClick={handleThemeToggle} aria-label="Toggle theme">
                        {isLightTheme ? <DarkThemeIcon /> : <LightThemeIcon />}
                    </button>
                </li>
            </ul>
        </nav>
    );
}