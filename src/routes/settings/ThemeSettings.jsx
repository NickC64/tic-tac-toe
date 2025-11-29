import { useState, useRef } from 'react';
import { useGameConfig } from '../../core/GameConfig.jsx';
import themeManager from '../../core/ThemeManager.js';
import { exportThemeFile, createThemeTemplate } from '../../core/ThemeFileLoader.js';

export default function ThemeSettings() {
  const {
    theme,
    applyTheme,
    getAvailableThemes,
    importTheme,
    exportTheme,
    getThemeTemplate,
    removeTheme,
    getImportedThemes,
  } = useGameConfig();

  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(null);
  const [importedThemes, setImportedThemes] = useState(() => getImportedThemes());
  const fileInputRef = useRef(null);

  const availableThemes = getAvailableThemes();

  // Separate built-in and imported themes
  const builtInThemeNames = themeManager.getBuiltInThemes();
  const builtInThemes = availableThemes.filter((name) =>
    builtInThemeNames.includes(name)
  );
  const importedThemeNames = availableThemes.filter(
    (name) => !builtInThemeNames.includes(name)
  );

  // Get current theme info
  const currentTheme = themeManager.getCurrentTheme();
  const isUsingBuiltIn = builtInThemes.includes(theme);

  // Get display value for dropdown - map 'dark'/'light' to 'default' for backward compatibility
  const getThemeSelectValue = () => {
    if (theme === 'dark' || theme === 'light') {
      return 'default';
    }
    return theme;
  };

  const handleThemeChange = (value) => {
    if (value === 'default') {
      // If switching to default, preserve current variant preference
      // ThemeManager will handle backward compatibility for 'dark'/'light'
      const currentIsLight = theme === 'light';
      applyTheme('default', currentIsLight);
    } else {
      applyTheme(value);
    }
  };

  const handleThemeImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError(null);
    setImportSuccess(null);

    try {
      const themeName = await importTheme(file);
      setImportedThemes(getImportedThemes());

      const themeObj = themeManager.getTheme(themeName);
      const config = themeObj?.getConfig();
      const displayName = config?.displayName || config?.name || themeName;

      setImportSuccess(`Theme "${displayName}" imported successfully!`);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setImportError(error.message);
    }
  };

  const handleExportTheme = () => {
    exportTheme();
  };

  const handleDownloadTemplate = () => {
    const template = getThemeTemplate() || createThemeTemplate();
    exportThemeFile(template, 'theme-template.json');
  };

  const handleRemoveTheme = (themeName) => {
    if (window.confirm(`Remove theme "${themeName}"?`)) {
      try {
        removeTheme(themeName);
        setImportedThemes(getImportedThemes());
        if (theme === themeName) {
          applyTheme('dark');
        }
      } catch (error) {
        setImportError(error.message);
      }
    }
  };

  // Filter built-in themes - separate default from others
  const otherBuiltInThemes = builtInThemes.filter(
    (name) => name !== 'default' && name !== 'dark' && name !== 'light'
  );

  // Font information for current theme
  const fontInfo = (() => {
    const config = currentTheme?.getConfig();
    return config?.fonts;
  })();

  return (
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

      {importError && <div className="error-message">{importError}</div>}

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
                    {themeObj &&
                      (() => {
                        const config = themeObj.getConfig();
                        return (
                          config.description && (
                            <span className="theme-description">
                              {config.description}
                            </span>
                          )
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
      {fontInfo && (fontInfo.google || fontInfo.local || fontInfo.properties) && (
        <div className="settings-field">
          <label>Font Information</label>
          <div className="font-info">
            {fontInfo.google && Object.keys(fontInfo.google).length > 0 && (
              <div>
                <strong>Google Fonts:</strong>
                <ul>
                  {Object.keys(fontInfo.google).map((font) => (
                    <li key={font}>{font}</li>
                  ))}
                </ul>
              </div>
            )}
            {fontInfo.local && Object.keys(fontInfo.local).length > 0 && (
              <div>
                <strong>Local Fonts:</strong>
                <ul>
                  {Object.keys(fontInfo.local).map((font) => (
                    <li key={font}>{font}</li>
                  ))}
                </ul>
              </div>
            )}
            {fontInfo.properties &&
              Object.keys(fontInfo.properties).length > 0 && (
                <div>
                  <strong>Font Properties:</strong>
                  <ul>
                    {Object.entries(fontInfo.properties).map(
                      ([prop, value]) => (
                        <li key={prop}>
                          <code>{prop}</code>: {value}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </div>
        </div>
      )}
    </section>
  );
}


