import { BaseTheme } from './BaseTheme.js';
import fontManager from '../FontManager.js';

/**
 * Default theme implementation with dark and light variants
 * Unified theme that works like ImportedTheme but for built-in default colors
 */
export class DefaultTheme extends BaseTheme {
  constructor() {
    super('default');
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
    if (!this.fontsLoaded && this.getConfig().fonts) {
      try {
        await fontManager.loadThemeFonts(this.getConfig().fonts);
        this.fontsLoaded = true;
      } catch (error) {
        console.warn('Failed to load theme fonts:', error);
      }
    }

    const config = this.getConfig();
    const variant = this.isLightMode ? 'light' : 'dark';
    const colors = config[variant] || config.dark || {};
    const fonts = config.fonts || {};
    
    // Remove other theme classes
    document.documentElement.classList.remove('light-theme');
    document.documentElement.classList.remove('theme-dark', 'theme-light', 'theme-default');
    document.documentElement.classList.add('theme-default');
    
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
    document.documentElement.classList.remove('theme-default');
    
    // Reset CSS custom properties (colors and fonts)
    const config = this.getConfig();
    const variant = this.isLightMode ? 'light' : 'dark';
    const colors = config[variant] || config.dark || {};
    const fonts = config.fonts || {};
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
      name: 'default',
      displayName: 'Default',
      description: 'The default theme with classic colors',
      author: 'Built-in',
      version: '1.0.0',
      dark: {
        '--bg-dark': 'oklch(0.1 0.045 220)',
        '--bg': 'oklch(0.15 0.045 220)',
        '--bg-light': 'oklch(0.2 0.045 220)',
        '--text': 'oklch(0.96 0.09 220)',
        '--text-muted': 'oklch(0.76 0.09 220)',
        '--highlight': 'oklch(0.5 0.09 220)',
        '--border': 'oklch(0.4 0.09 220)',
        '--border-muted': 'oklch(0.3 0.09 220)',
        '--primary': 'oklch(0.76 0.1 220)',
        '--secondary': 'oklch(0.76 0.1 40)',
        '--danger': 'oklch(0.7 0.09 30)',
        '--warning': 'oklch(0.7 0.09 100)',
        '--success': 'oklch(0.7 0.09 160)',
        '--info': 'oklch(0.7 0.09 260)',
      },
      light: {
        '--bg-dark': 'oklch(0.92 0.045 220)',
        '--bg': 'oklch(0.96 0.045 220)',
        '--bg-light': 'oklch(1 0.045 220)',
        '--text': 'oklch(0.15 0.09 220)',
        '--text-muted': 'oklch(0.4 0.09 220)',
        '--highlight': 'oklch(1 0.09 220)',
        '--border': 'oklch(0.6 0.09 220)',
        '--border-muted': 'oklch(0.7 0.09 220)',
        '--primary': 'oklch(0.4 0.1 220)',
        '--secondary': 'oklch(0.4 0.1 40)',
        '--danger': 'oklch(0.5 0.09 30)',
        '--warning': 'oklch(0.5 0.09 100)',
        '--success': 'oklch(0.5 0.09 160)',
        '--info': 'oklch(0.5 0.09 260)',
      },
      fonts: {
        google: {
          'Roboto Slab': ['400', '700'],
          'Caprasimo': ['400'],
        },
        properties: {
          '--font-body': "'Roboto Slab', sans-serif",
          '--font-heading': "'Caprasimo', cursive",
          '--font-mono': "'Roboto Slab', monospace",
        },
      },
    };
  }
}

