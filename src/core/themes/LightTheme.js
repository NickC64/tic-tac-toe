import { BaseTheme } from './BaseTheme.js';

/**
 * Light theme implementation
 */
export class LightTheme extends BaseTheme {
  constructor() {
    super('light');
  }

  apply() {
    document.documentElement.classList.add('light-theme');
    document.documentElement.classList.add('theme-light');
    
    // Reset font properties to defaults from theme.scss
    const root = document.documentElement;
    root.style.setProperty('--font-body', "'Roboto Slab', sans-serif");
    root.style.setProperty('--font-heading', "'Caprasimo', cursive");
    root.style.setProperty('--font-mono', "'Roboto Slab', monospace");
  }

  getConfig() {
    return {
      name: 'light',
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
      }
    };
  }
}

