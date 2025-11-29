import { BaseTheme } from './BaseTheme.js';

/**
 * Dark theme implementation
 */
export class DarkTheme extends BaseTheme {
  constructor() {
    super('dark');
  }

  apply() {
    document.documentElement.classList.remove('light-theme');
    document.documentElement.classList.add('theme-dark');
    
    // Reset font properties to defaults from theme.scss
    const root = document.documentElement;
    root.style.setProperty('--font-body', "'Roboto Slab', sans-serif");
    root.style.setProperty('--font-heading', "'Caprasimo', cursive");
    root.style.setProperty('--font-mono', "'Roboto Slab', monospace");
  }

  getConfig() {
    return {
      name: 'dark',
      colors: {
        '--bg-dark': 'oklch(0.1 0.045 220)',
        '--bg': 'oklch(0.15 0.045 220)',
        '--bg-light': 'oklch(0.2 0.045 220)',
        '--text': 'oklch(0.96 0.09 220)',
        '--text-muted': 'oklch(0.76 0.09 220)',
        '--highlight': 'oklch(0.5 0.09 220)',
        '--border': 'oklch(0.4 0.09 220)',
        '--border-muted': 'oklch(0.3 0.09 220)',
        '--primary': 'oklch(0.76 0.1 220)',
      }
    };
  }
}

