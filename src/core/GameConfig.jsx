/**
 * Game Configuration Context
 * Manages all game customizations: pieces, themes, sounds
 */
import { createContext, useContext, useEffect, useState } from 'react';
import pieceFactory from './PieceFactory.js';
import themeManager from './ThemeManager.js';
import soundManager from './SoundManager.js';
import { loadThemeFile, exportThemeFile, createThemeTemplate } from './ThemeFileLoader.js';

const GameConfigContext = createContext(null);

export function GameConfigProvider({ children, config = {} }) {
  // Load saved piece images from localStorage
  const loadSavedPieceImages = () => {
    if (typeof localStorage !== 'undefined') {
      const savedImages = localStorage.getItem('pieceImages');
      if (savedImages) {
        try {
          return JSON.parse(savedImages);
        } catch (e) {
          console.warn('Failed to parse saved piece images:', e);
        }
      }
    }
    return {};
  };

  const [pieceType, setPieceType] = useState(config.pieceType || 'text');
  const [pieceConfig, setPieceConfig] = useState(() => {
    const savedImages = loadSavedPieceImages();
    return {
      ...config.pieceConfig,
      imageMap: savedImages
    };
  });
  const [theme, setTheme] = useState(config.theme || 'dark');
  const [soundsEnabled, setSoundsEnabled] = useState(true);

  // Initialize theme manager
  useEffect(() => {
    themeManager.initialize();
    const currentTheme = themeManager.getCurrentTheme();
    if (currentTheme) {
      setTheme(currentTheme.name);
    }
  }, []);

  // Initialize sound manager
  useEffect(() => {
    soundManager.initialize();
    setSoundsEnabled(soundManager.enabled);
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    if (theme) {
      themeManager.applyTheme(theme);
    }
  }, [theme]);

  const value = {
    // Piece configuration
    pieceType,
    setPieceType,
    pieceConfig,
    setPieceConfig,
    getPieceComponent: (symbol, props = {}) => {
      const PieceComponent = pieceFactory.create(pieceType, props);
      // Pass imageMap to IconPiece when using icon type
      const configProps = pieceType === 'icon' && pieceConfig.imageMap
        ? { ...pieceConfig, imageMap: pieceConfig.imageMap }
        : pieceConfig;
      return <PieceComponent symbol={symbol} {...configProps} {...props} />;
    },
    getAvailablePieceTypes: () => pieceFactory.getAvailableTypes(),

    // Theme configuration
    theme,
    setTheme,
    applyTheme: (name) => {
      themeManager.applyTheme(name);
      const currentTheme = themeManager.getCurrentTheme();
      if (currentTheme) {
        setTheme(currentTheme.name);
      }
    },
    toggleTheme: () => {
      themeManager.toggle();
      const currentTheme = themeManager.getCurrentTheme();
      if (currentTheme) {
        setTheme(currentTheme.name);
      }
    },
    getAvailableThemes: () => themeManager.getAvailableThemes(),
    importTheme: async (file) => {
      const themeData = await loadThemeFile(file);
      const themeName = `imported-${Date.now()}`;
      themeManager.importTheme(themeName, themeData);
      return themeName;
    },
    exportTheme: () => {
      const currentTheme = themeManager.getCurrentTheme();
      if (currentTheme) {
        const config = currentTheme.getConfig();
        exportThemeFile({
          name: config.displayName || config.name,
          description: config.description || '',
          author: config.author || '',
          version: config.version || '1.0.0',
          dark: config.dark,
          light: config.light,
        }, `${config.name}-theme.json`);
      }
    },
    getThemeTemplate: () => createThemeTemplate(),
    removeTheme: (name) => themeManager.removeTheme(name),
    getImportedThemes: () => Array.from(themeManager.getImportedThemes().keys()),

    // Sound configuration
    soundsEnabled,
    setSoundsEnabled: (enabled) => {
      soundManager.setEnabled(enabled);
      setSoundsEnabled(enabled);
    },
    soundVolume: soundManager.volume,
    setSoundVolume: (volume) => soundManager.setVolume(volume),

    // Direct access to managers (for advanced usage)
    pieceFactory,
    themeManager,
    soundManager,
  };

  return (
    <GameConfigContext.Provider value={value}>
      {children}
    </GameConfigContext.Provider>
  );
}

export function useGameConfig() {
  const context = useContext(GameConfigContext);
  if (!context) {
    throw new Error('useGameConfig must be used within GameConfigProvider');
  }
  return context;
}

