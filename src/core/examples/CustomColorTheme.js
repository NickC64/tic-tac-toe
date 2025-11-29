/**
 * Example: Custom Color Theme
 * Shows how to create a custom theme with different colors
 */
import { BaseTheme } from '../themes/BaseTheme.js';

export class CustomColorTheme extends BaseTheme {
  constructor() {
    super('custom-color');
  }

  apply() {
    document.documentElement.classList.add('theme-custom-color');
    
    // Set custom CSS variables
    const root = document.documentElement;
    root.style.setProperty('--bg-dark', 'oklch(0.2 0.1 300)');
    root.style.setProperty('--bg', 'oklch(0.25 0.1 300)');
    root.style.setProperty('--bg-light', 'oklch(0.3 0.1 300)');
    root.style.setProperty('--text', 'oklch(0.9 0.05 300)');
    root.style.setProperty('--primary', 'oklch(0.7 0.2 300)');
    // ... set other properties
  }

  remove() {
    document.documentElement.classList.remove('theme-custom-color');
    // Optionally reset CSS variables
  }

  getConfig() {
    return {
      name: 'custom-color',
      colors: {
        '--bg-dark': 'oklch(0.2 0.1 300)',
        '--bg': 'oklch(0.25 0.1 300)',
        '--primary': 'oklch(0.7 0.2 300)',
        // ... other colors
      }
    };
  }
}

// To use this:
// import themeManager from '../core/ThemeManager.js';
// import { CustomColorTheme } from './examples/CustomColorTheme.js';
// themeManager.register('custom-color', new CustomColorTheme());

