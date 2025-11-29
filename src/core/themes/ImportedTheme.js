import { BaseTheme } from './BaseTheme.js';
import fontManager from '../FontManager.js';

/**
 * Theme class for imported theme files
 * Supports both light and dark variants from a single file
 */
export class ImportedTheme extends BaseTheme {
  constructor(name, themeData) {
    super(name);
    this.themeData = themeData;
    this.isLightMode = false;
    this.fontsLoaded = false;
  }

  /**
   * Set whether to use light or dark variant
   * @param {boolean} isLight - Whether to use light variant
   */
  setVariant(isLight) {
    this.isLightMode = isLight;
  }

  /**
   * Apply the theme to the document
   */
  async apply() {
    // Load fonts if not already loaded
    if (!this.fontsLoaded && this.themeData.fonts) {
      try {
        await fontManager.loadThemeFonts(this.themeData.fonts);
        this.fontsLoaded = true;
      } catch (error) {
        console.warn('Failed to load theme fonts:', error);
      }
    }

    const variant = this.isLightMode ? 'light' : 'dark';
    const colors = this.themeData[variant] || this.themeData.dark || {};
    const fonts = this.themeData.fonts || {};
    
    // Remove other theme classes
    document.documentElement.classList.remove('light-theme');
    document.documentElement.classList.remove('theme-dark', 'theme-light');
    document.documentElement.classList.add(`theme-${this.name}`);
    
    if (this.isLightMode) {
      document.documentElement.classList.add('light-theme');
    }

    // Apply CSS custom properties (colors and fonts)
    const root = document.documentElement;
    
    // Apply color properties
    Object.entries(colors).forEach(([property, value]) => {
      if (property.startsWith('--')) {
        root.style.setProperty(property, value);
      }
    });

    // Apply font properties
    if (fonts.properties) {
      Object.entries(fonts.properties).forEach(([property, value]) => {
        if (property.startsWith('--font-')) {
          root.style.setProperty(property, value);
        }
      });
    }
  }

  /**
   * Remove the theme from the document
   */
  remove() {
    document.documentElement.classList.remove(`theme-${this.name}`);
    
    // Reset CSS custom properties (colors and fonts)
    const variant = this.isLightMode ? 'light' : 'dark';
    const colors = this.themeData[variant] || this.themeData.dark || {};
    const fonts = this.themeData.fonts || {};
    const root = document.documentElement;
    
    // Remove color properties
    Object.keys(colors).forEach((property) => {
      if (property.startsWith('--')) {
        root.style.removeProperty(property);
      }
    });
    
    // Remove font properties
    if (fonts.properties) {
      Object.keys(fonts.properties).forEach((property) => {
        if (property.startsWith('--font-')) {
          root.style.removeProperty(property);
        }
      });
    }
  }

  /**
   * Get theme configuration
   * @returns {object} Theme configuration object
   */
  getConfig() {
    return {
      name: this.name,
      displayName: this.themeData.name || this.name,
      dark: this.themeData.dark || {},
      light: this.themeData.light || {},
      fonts: this.themeData.fonts || {},
      description: this.themeData.description || '',
      author: this.themeData.author || '',
      version: this.themeData.version || '1.0.0',
    };
  }

  /**
   * Get the raw theme data
   * @returns {object}
   */
  getThemeData() {
    return this.themeData;
  }
}

