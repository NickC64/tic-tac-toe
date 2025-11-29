/**
 * Strategy Pattern for theme management
 * Allows switching between different theme implementations
 */
import { DarkTheme, LightTheme } from './themes/index.js';
import { ImportedTheme } from './themes/ImportedTheme.js';

class ThemeManager {
  constructor() {
    this.themes = new Map();
    this.currentTheme = null;
    this.defaultTheme = 'dark';
    this.isLightMode = false;
    
    // Register default themes
    this.register('dark', new DarkTheme());
    this.register('light', new LightTheme());
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
   * @param {string} name - Theme name to apply
   * @param {boolean} isLight - Whether to use light variant (for imported themes)
   */
  applyTheme(name, isLight = null) {
    const theme = this.themes.get(name);
    if (!theme) {
      console.warn(`Theme "${name}" not found, using default`);
      return this.applyTheme(this.defaultTheme, isLight);
    }

    // Handle light mode for imported themes
    if (theme instanceof ImportedTheme) {
      if (isLight !== null) {
        this.isLightMode = isLight;
      }
      theme.setVariant(this.isLightMode);
    } else {
      // For built-in themes, determine light mode from theme name
      this.isLightMode = name === 'light';
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
    
    // Store preference
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', name);
      localStorage.setItem('themeLightMode', this.isLightMode.toString());
    }
  }

  /**
   * Get current theme
   * @returns {BaseTheme|null}
   */
  getCurrentTheme() {
    return this.currentTheme;
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
    return ['dark', 'light'];
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
    
    if (theme instanceof ImportedTheme) {
      const config = theme.getConfig();
      return config.displayName || name;
    }
    
    // Built-in themes
    if (name === 'dark') return 'Default (Dark)';
    if (name === 'light') return 'Default (Light)';
    return name;
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
   * Toggle between light and dark themes
   */
  toggle() {
    const currentName = this.currentTheme?.name || this.defaultTheme;
    
    // If current theme is an imported theme, toggle its variant
    if (this.currentTheme instanceof ImportedTheme) {
      this.isLightMode = !this.isLightMode;
      this.applyTheme(currentName, this.isLightMode);
    } else {
      // For built-in themes, switch between dark and light
      const newTheme = currentName === 'light' ? 'dark' : 'light';
      this.applyTheme(newTheme);
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
    
    // Store imported themes in localStorage
    if (typeof localStorage !== 'undefined') {
      const importedThemes = JSON.parse(localStorage.getItem('importedThemes') || '{}');
      importedThemes[name] = themeData;
      localStorage.setItem('importedThemes', JSON.stringify(importedThemes));
    }
    
    return name;
  }

  /**
   * Remove an imported theme
   * @param {string} name - Theme name to remove
   */
  removeTheme(name) {
    // Don't allow removing built-in themes
    if (name === 'dark' || name === 'light') {
      throw new Error('Cannot remove built-in themes');
    }

    this.themes.delete(name);
    
    // Remove from localStorage
    if (typeof localStorage !== 'undefined') {
      const importedThemes = JSON.parse(localStorage.getItem('importedThemes') || '{}');
      delete importedThemes[name];
      localStorage.setItem('importedThemes', JSON.stringify(importedThemes));
      
      // If it was the current theme, switch to default
      if (this.currentTheme?.name === name) {
        this.applyTheme(this.defaultTheme);
      }
    }
  }

  /**
   * Get all imported themes
   * @returns {Map<string, ImportedTheme>}
   */
  getImportedThemes() {
    const imported = new Map();
    this.themes.forEach((theme, name) => {
      if (theme instanceof ImportedTheme) {
        imported.set(name, theme);
      }
    });
    return imported;
  }

  /**
   * Load imported themes from localStorage
   */
  loadImportedThemes() {
    if (typeof localStorage === 'undefined') return;
    
    const importedThemes = JSON.parse(localStorage.getItem('importedThemes') || '{}');
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
    
    const savedTheme = typeof localStorage !== 'undefined' 
      ? localStorage.getItem('theme') 
      : null;
    const savedLightMode = typeof localStorage !== 'undefined'
      ? localStorage.getItem('themeLightMode') === 'true'
      : false;
    
    const themeName = savedTheme || this.defaultTheme;
    this.applyTheme(themeName, savedLightMode);
  }
}

// Singleton instance
const themeManager = new ThemeManager();

export default themeManager;
export { ThemeManager };

