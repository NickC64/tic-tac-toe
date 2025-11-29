/**
 * Strategy Pattern for theme management
 * Allows switching between different theme implementations
 */
import { DefaultTheme } from './themes/DefaultTheme.js';
import { ImportedTheme } from './themes/ImportedTheme.js';
import { builtInThemeData } from './themes/builtInThemes.js';
import {
  saveThemePreference,
  loadThemePreference,
  loadImportedThemes,
  saveImportedThemes,
} from './storage.js';

class ThemeManager {
  constructor() {
    this.themes = new Map();
    this.currentTheme = null;
    this.defaultTheme = 'default';
    this.isLightMode = false;
    
    // Register unified default theme
    const defaultTheme = new DefaultTheme();
    this.register('default', defaultTheme);
    
    // Register built-in example themes
    this.loadBuiltInThemes();
  }

  /**
   * Load built-in example themes
   */
  loadBuiltInThemes() {
    Object.entries(builtInThemeData).forEach(([key, themeData]) => {
      const theme = new ImportedTheme(key, themeData);
      this.register(key, theme);
    });
  }

  /**
   * Register a new theme
   * @param {string} name - Theme identifier
   * @param {BaseTheme} theme - Theme instance
   */
  register(name, theme) {
    this.themes.set(name, theme);
  }

  /**
   * Apply a theme by name
   * @param {string} name - Theme name to apply (supports 'dark'/'light' for backward compatibility)
   * @param {boolean} isLight - Whether to use light variant
   */
  applyTheme(name, isLight = null) {
    // Handle backward compatibility: map 'dark'/'light' to 'default'
    let actualName = name;
    if (name === 'dark' || name === 'light') {
      actualName = 'default';
      if (isLight === null) {
        isLight = name === 'light';
      }
    }

    const theme = this.themes.get(actualName);
    if (!theme) {
      console.warn(`Theme "${actualName}" not found, using default`);
      return this.applyTheme(this.defaultTheme, isLight);
    }

    // Handle variant switching for themes that support it (DefaultTheme and ImportedTheme)
    if (theme instanceof ImportedTheme || theme instanceof DefaultTheme) {
      if (isLight !== null) {
        this.isLightMode = isLight;
      }
      theme.setVariant(this.isLightMode);
    }

    // Remove current theme (this will clean up font properties)
    if (this.currentTheme) {
      this.currentTheme.remove();
    }

    // Apply new theme (handle async font loading)
    const applyResult = theme.apply();
    if (applyResult instanceof Promise) {
      applyResult.catch(error => {
        console.error('Error applying theme:', error);
      });
    }
    this.currentTheme = theme;

    // Store preference via centralized storage (use actual theme name)
    saveThemePreference(actualName, this.isLightMode);
  }

  /**
   * Get current theme
   * @returns {BaseTheme|null}
   */
  getCurrentTheme() {
    return this.currentTheme;
  }

  /**
   * Get current light mode state
   * @returns {boolean}
   */
  getIsLightMode() {
    return this.isLightMode;
  }

  /**
   * Get theme by name
   * @param {string} name - Theme name
   * @returns {BaseTheme|undefined}
   */
  getTheme(name) {
    return this.themes.get(name);
  }

  /**
   * Get all available themes
   * @returns {string[]}
   */
  getAvailableThemes() {
    return Array.from(this.themes.keys());
  }

  /**
   * Get built-in theme names
   * @returns {string[]}
   */
  getBuiltInThemes() {
    return ['default', 'purple', 'ocean', 'sunset'];
  }

  /**
   * Check if a theme is built-in
   * @param {string} name - Theme name
   * @returns {boolean}
   */
  isBuiltInTheme(name) {
    return this.getBuiltInThemes().includes(name);
  }

  /**
   * Get theme display name
   * @param {string} name - Theme name
   * @returns {string}
   */
  getThemeDisplayName(name) {
    const theme = this.themes.get(name);
    if (!theme) return name;
    
    const config = theme.getConfig();
    return config.displayName || name;
  }

  /**
   * Initialize theme from localStorage or use default
   */
  initialize() {
    const savedTheme = typeof localStorage !== 'undefined' 
      ? localStorage.getItem('theme') 
      : null;
    const themeName = savedTheme || this.defaultTheme;
    this.applyTheme(themeName);
  }

  /**
   * Toggle between light and dark variants
   */
  toggle() {
    const currentName = this.currentTheme?.name || this.defaultTheme;
    
    // If current theme supports variants (DefaultTheme or ImportedTheme), toggle variant
    if (this.currentTheme instanceof ImportedTheme || this.currentTheme instanceof DefaultTheme) {
      this.isLightMode = !this.isLightMode;
      this.applyTheme(currentName, this.isLightMode);
    } else {
      // Fallback: switch to default theme with opposite variant
      this.isLightMode = !this.isLightMode;
      this.applyTheme(this.defaultTheme, this.isLightMode);
    }
  }

  /**
   * Import a theme from a file
   * @param {string} name - Theme identifier
   * @param {object} themeData - Theme data object
   * @returns {string} The registered theme name
   */
  importTheme(name, themeData) {
    const theme = new ImportedTheme(name, themeData);
    this.register(name, theme);
    
    // Store imported themes via centralized storage
    const importedThemes = loadImportedThemes();
    importedThemes[name] = themeData;
    saveImportedThemes(importedThemes);
    
    return name;
  }

  /**
   * Remove an imported theme
   * @param {string} name - Theme name to remove
   */
  removeTheme(name) {
    // Don't allow removing built-in themes
    if (this.getBuiltInThemes().includes(name)) {
      throw new Error('Cannot remove built-in themes');
    }

    this.themes.delete(name);

    // Remove from centralized storage
    const importedThemes = loadImportedThemes();
    delete importedThemes[name];
    saveImportedThemes(importedThemes);

    // If it was the current theme, switch to default
    if (this.currentTheme?.name === name) {
      this.applyTheme(this.defaultTheme);
    }
  }

  /**
   * Get all imported themes (excluding built-in themes)
   * @returns {Map<string, ImportedTheme>}
   */
  getImportedThemes() {
    const imported = new Map();
    const builtInNames = this.getBuiltInThemes();
    this.themes.forEach((theme, name) => {
      // Only include ImportedTheme instances that are NOT built-in themes
      if (theme instanceof ImportedTheme && !builtInNames.includes(name)) {
        imported.set(name, theme);
      }
    });
    return imported;
  }

  /**
   * Check if a theme supports variants (has setVariant method)
   * @param {string} name - Theme name
   * @returns {boolean}
   */
  themeSupportsVariants(name) {
    const theme = this.themes.get(name);
    return theme instanceof ImportedTheme || theme instanceof DefaultTheme;
  }

  /**
   * Load imported themes from localStorage
   */
  loadImportedThemes() {
    const importedThemes = loadImportedThemes();
    Object.entries(importedThemes).forEach(([name, themeData]) => {
      try {
        this.importTheme(name, themeData);
      } catch (error) {
        console.error(`Failed to load imported theme "${name}":`, error);
      }
    });
  }

  /**
   * Initialize theme from localStorage or use default
   */
  initialize() {
    // Load imported themes first
    this.loadImportedThemes();
    
    const prefs = loadThemePreference(this.defaultTheme);
    let themeName = prefs.theme || this.defaultTheme;
    
    // Handle backward compatibility: migrate 'dark'/'light' to 'default'
    if (themeName === 'dark' || themeName === 'light') {
      themeName = 'default';
      // If we had 'light' saved, use light variant
      if (prefs.theme === 'light' && prefs.isLightMode === undefined) {
        prefs.isLightMode = true;
      }
    }
    
    this.applyTheme(themeName, prefs.isLightMode);
  }
}

// Singleton instance
const themeManager = new ThemeManager();

export default themeManager;
export { ThemeManager };

