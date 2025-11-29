/**
 * Base theme class using Strategy pattern
 * All themes must extend this class
 */
export class BaseTheme {
  constructor(name) {
    this.name = name;
  }

  /**
   * Apply the theme to the document
   * Should set CSS custom properties
   */
  apply() {
    throw new Error('apply() must be implemented by theme subclass');
  }

  /**
   * Remove the theme from the document
   */
  remove() {
    // Default implementation - remove theme class
    document.documentElement.classList.remove(`theme-${this.name}`);
  }

  /**
   * Get theme configuration
   * @returns {object} Theme configuration object
   */
  getConfig() {
    throw new Error('getConfig() must be implemented by theme subclass');
  }
}

