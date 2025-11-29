import { BaseTheme } from './BaseTheme.js';

/**
 * Light theme implementation
 */
export class LightTheme extends BaseTheme {
  constructor() {
    super('light');
  }

  apply() {
    const root = document.documentElement;

    // Update theme classes
    root.classList.add('light-theme');
    root.classList.add('theme-light');
    root.classList.remove('theme-dark');
    root.classList.remove('theme-light-default');
    
    // Apply colors and font properties from config
    const { colors = {}, fonts = {} } = this.getConfig();

    Object.entries(colors).forEach(([property, value]) => {
      if (property.startsWith('--')) {
        root.style.setProperty(property, value);
      }
    });

    if (fonts.properties) {
      Object.entries(fonts.properties).forEach(([property, value]) => {
        if (property.startsWith('--font-')) {
          root.style.setProperty(property, value);
        }
      });
    }
  }

  getConfig() {
    return {
      name: 'light',
      // Default theme color tokens (match values from theme.scss)
      colors: {
        '--bg-dark': 'oklch(0.92 0.045 220)',
        '--bg': 'oklch(0.96 0.045 220)',
        '--bg-light': 'oklch(1 0.045 220)',
        '--text': 'oklch(0.15 0.09 220)',
        '--text-muted': 'oklch(0.4 0.09 220)',
        '--highlight': 'oklch(1 0.09 220)',
        '--border': 'oklch(0.6 0.09 220)',
        '--border-muted': 'oklch(0.7 0.09 220)',
        '--primary': 'oklch(0.4 0.1 220)',
      },
      // Expose font information so the Settings UI can display it
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

