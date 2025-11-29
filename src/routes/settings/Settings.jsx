import { useState, useRef } from 'react';
import { useGameConfig } from '../../core/GameConfig.jsx';
import { loadThemeFile, exportThemeFile, createThemeTemplate } from '../../core/ThemeFileLoader.js';
import themeManager from '../../core/ThemeManager.js';
import './settings.scss';

export default function Settings() {
  const {
    pieceType,
    setPieceType,
    pieceConfig,
    setPieceConfig,
    getAvailablePieceTypes,
    theme,
    applyTheme,
    getAvailableThemes,
    soundsEnabled,
    setSoundsEnabled,
    soundVolume,
    setSoundVolume,
  } = useGameConfig();

  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(null);
  const [importedThemes, setImportedThemes] = useState(() => {
    const imported = themeManager.getImportedThemes();
    return Array.from(imported.keys());
  });
  const fileInputRef = useRef(null);

  const handleThemeImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(null);

    try {
      const themeData = await loadThemeFile(file);
      const themeName = `imported-${Date.now()}`;
      
      themeManager.importTheme(themeName, themeData);
      setImportedThemes(Array.from(themeManager.getImportedThemes().keys()));
      setImportSuccess(`Theme "${themeData.name || themeName}" imported successfully!`);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setImportError(error.message);
    }
  };

  const handleExportTheme = () => {
    const currentTheme = themeManager.getCurrentTheme();
    if (!currentTheme) return;

    const config = currentTheme.getConfig();
    const themeData = {
      name: config.displayName || config.name,
      description: config.description || '',
      author: config.author || '',
      version: config.version || '1.0.0',
      dark: config.dark,
      light: config.light,
    };

    exportThemeFile(themeData, `${config.name}-theme.json`);
  };

  const handleDownloadTemplate = () => {
    const template = createThemeTemplate();
    exportThemeFile(template, 'theme-template.json');
  };

  const handleRemoveTheme = (themeName) => {
    if (window.confirm(`Remove theme "${themeName}"?`)) {
      try {
        themeManager.removeTheme(themeName);
        setImportedThemes(Array.from(themeManager.getImportedThemes().keys()));
        if (theme === themeName) {
          applyTheme('dark');
        }
      } catch (error) {
        setImportError(error.message);
      }
    }
  };

  const handlePieceImageUpload = (symbol, file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setImportError('Please upload a valid image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImportError('Image file size must be less than 5MB.');
      return;
    }

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      setPieceConfig(prev => ({
        ...prev,
        imageMap: {
          ...prev.imageMap,
          [symbol]: imageDataUrl
        }
      }));

      // Save to localStorage
      if (typeof localStorage !== 'undefined') {
        const savedImages = JSON.parse(localStorage.getItem('pieceImages') || '{}');
        savedImages[symbol] = imageDataUrl;
        localStorage.setItem('pieceImages', JSON.stringify(savedImages));
      }
    };
    reader.onerror = () => {
      setImportError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePieceImage = (symbol) => {
    setPieceConfig(prev => {
      const newImageMap = { ...prev.imageMap };
      delete newImageMap[symbol];
      return {
        ...prev,
        imageMap: Object.keys(newImageMap).length > 0 ? newImageMap : undefined
      };
    });

    // Remove from localStorage
    if (typeof localStorage !== 'undefined') {
      const savedImages = JSON.parse(localStorage.getItem('pieceImages') || '{}');
      delete savedImages[symbol];
      if (Object.keys(savedImages).length > 0) {
        localStorage.setItem('pieceImages', JSON.stringify(savedImages));
      } else {
        localStorage.removeItem('pieceImages');
      }
    }
  };

  const availableThemes = getAvailableThemes();
  const availablePieceTypes = getAvailablePieceTypes();
  
  // Separate built-in and imported themes
  const builtInThemeNames = themeManager.getBuiltInThemes();
  const builtInThemes = availableThemes.filter(name => 
    builtInThemeNames.includes(name)
  );
  const importedThemeNames = availableThemes.filter(name => 
    !builtInThemeNames.includes(name)
  );
  
  // Get current theme info
  const currentTheme = themeManager.getCurrentTheme();
  const isUsingBuiltIn = builtInThemes.includes(theme);
  
  // Get display value for dropdown - show "default" for both dark and light
  const getThemeSelectValue = () => {
    if (theme === 'dark' || theme === 'light') {
      return 'default';
    }
    return theme;
  };
  
  const handleThemeChange = (value) => {
    if (value === 'default') {
      // If switching to default, use the current light/dark preference
      // or default to dark
      const currentIsLight = theme === 'light';
      applyTheme(currentIsLight ? 'light' : 'dark');
    } else {
      applyTheme(value);
    }
  };
  
  // Filter built-in themes - separate default from others
  const otherBuiltInThemes = builtInThemes.filter(name => name !== 'dark' && name !== 'light');

  return (
    <main id="settings-main">
      <h1>Settings</h1>

      {/* Theme Settings */}
      <section className="settings-section">
        <h2>Theme</h2>
        
        <div className="settings-field">
          <label htmlFor="theme-select">Theme</label>
          <select
            id="theme-select"
            value={getThemeSelectValue()}
            onChange={(e) => handleThemeChange(e.target.value)}
          >
            <optgroup label="Built-in Themes">
              <option value="default">Default</option>
              {otherBuiltInThemes.map((themeName) => (
                <option key={themeName} value={themeName}>
                  {themeManager.getThemeDisplayName(themeName)}
                </option>
              ))}
            </optgroup>
            {importedThemeNames.length > 0 && (
              <optgroup label="Imported Themes">
                {importedThemeNames.map((themeName) => (
                  <option key={themeName} value={themeName}>
                    {themeManager.getThemeDisplayName(themeName)}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          <p className="help-text">
            {isUsingBuiltIn 
              ? 'Use the theme toggle button (🌙/☀️) in the navbar to switch between light and dark modes.'
              : 'Use the theme toggle button (🌙/☀️) in the navbar to switch between light and dark variants of this theme.'}
          </p>
        </div>

        {/* Import Theme */}
        <div className="settings-field">
          <label htmlFor="theme-import">Import Theme File</label>
          <div className="file-upload-group">
            <input
              ref={fileInputRef}
              id="theme-import"
              type="file"
              accept=".json,application/json"
              onChange={handleThemeImport}
            />
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="secondary-button"
            >
              Download Template
            </button>
          </div>
          <p className="help-text">
            Import a JSON theme file containing color sets for both light and dark modes.
          </p>
        </div>

        {importError && (
          <div className="error-message">{importError}</div>
        )}

        {importSuccess && (
          <div className="success-message">{importSuccess}</div>
        )}

        {/* Imported Themes List */}
        {importedThemes.length > 0 && (
          <div className="settings-field">
            <label>Your Imported Themes</label>
            <ul className="imported-themes-list">
              {importedThemes.map((themeName) => {
                const themeObj = themeManager.getTheme(themeName);
                const displayName = themeManager.getThemeDisplayName(themeName);
                return (
                  <li key={themeName}>
                    <div className="theme-info">
                      <span className="theme-name">{displayName}</span>
                      {themeObj && (() => {
                        const config = themeObj.getConfig();
                        return config.description && (
                          <span className="theme-description">{config.description}</span>
                        );
                      })()}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTheme(themeName)}
                      className="remove-button"
                      title={`Remove ${displayName}`}
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="settings-field">
          <button
            type="button"
            onClick={handleExportTheme}
            className="secondary-button"
          >
            Export Current Theme
          </button>
        </div>

        {/* Font Information */}
        {(() => {
          const currentTheme = themeManager.getCurrentTheme();
          const config = currentTheme?.getConfig();
          const fonts = config?.fonts;
          
          if (fonts && (fonts.google || fonts.local || fonts.properties)) {
            return (
              <div className="settings-field">
                <label>Font Information</label>
                <div className="font-info">
                  {fonts.google && Object.keys(fonts.google).length > 0 && (
                    <div>
                      <strong>Google Fonts:</strong>
                      <ul>
                        {Object.keys(fonts.google).map(font => (
                          <li key={font}>{font}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {fonts.local && Object.keys(fonts.local).length > 0 && (
                    <div>
                      <strong>Local Fonts:</strong>
                      <ul>
                        {Object.keys(fonts.local).map(font => (
                          <li key={font}>{font}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {fonts.properties && Object.keys(fonts.properties).length > 0 && (
                    <div>
                      <strong>Font Properties:</strong>
                      <ul>
                        {Object.entries(fonts.properties).map(([prop, value]) => (
                          <li key={prop}>
                            <code>{prop}</code>: {value}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          }
          return null;
        })()}
      </section>

      {/* Board Piece Settings */}
      <section className="settings-section">
        <h2>Board Pieces</h2>
        
        <div className="settings-field">
          <label htmlFor="piece-type-select">Piece Type</label>
          <select
            id="piece-type-select"
            value={pieceType}
            onChange={(e) => setPieceType(e.target.value)}
          >
            {availablePieceTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          <p className="help-text">
            Choose how board pieces (X, O) are displayed.
          </p>
        </div>

        {/* Custom Image Upload for Icon Piece Type */}
        {pieceType === 'icon' && (
          <>
            <div className="settings-field">
              <label htmlFor="piece-x-image">Custom Image for X</label>
              <div className="image-upload-group">
                <input
                  id="piece-x-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePieceImageUpload('X', e.target.files?.[0])}
                />
                {pieceConfig.imageMap?.X && (
                  <div className="image-preview-group">
                    <img
                      src={pieceConfig.imageMap.X}
                      alt="X preview"
                      className="image-preview"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePieceImage('X')}
                      className="remove-image-button"
                      title="Remove X image"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <p className="help-text">
                Upload a custom image to use for X pieces. Recommended: square images (e.g., 200x200px).
              </p>
            </div>

            <div className="settings-field">
              <label htmlFor="piece-o-image">Custom Image for O</label>
              <div className="image-upload-group">
                <input
                  id="piece-o-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePieceImageUpload('O', e.target.files?.[0])}
                />
                {pieceConfig.imageMap?.O && (
                  <div className="image-preview-group">
                    <img
                      src={pieceConfig.imageMap.O}
                      alt="O preview"
                      className="image-preview"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePieceImage('O')}
                      className="remove-image-button"
                      title="Remove O image"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <p className="help-text">
                Upload a custom image to use for O pieces. Recommended: square images (e.g., 200x200px).
              </p>
            </div>
          </>
        )}
      </section>

      {/* Sound Settings */}
      <section className="settings-section">
        <h2>Sound Effects</h2>
        
        <div className="settings-field">
          <label>
            <input
              type="checkbox"
              checked={soundsEnabled}
              onChange={(e) => setSoundsEnabled(e.target.checked)}
            />
            Enable Sound Effects
          </label>
        </div>

        {soundsEnabled && (
          <div className="settings-field">
            <label htmlFor="sound-volume">
              Volume: {Math.round(soundVolume * 100)}%
            </label>
            <input
              id="sound-volume"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={soundVolume}
              onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
            />
          </div>
        )}
      </section>
    </main>
  );
}

