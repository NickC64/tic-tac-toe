/**
 * Font Manager for loading and managing custom fonts
 * Supports Google Fonts, local fonts, and web fonts
 */
class FontManager {
  constructor() {
    this.loadedFonts = new Set();
    this.fontLinks = new Map();
  }

  /**
   * Load a Google Font
   * @param {string} fontFamily - Font family name (e.g., "Roboto", "Open Sans")
   * @param {string[]} weights - Font weights to load (e.g., ["400", "700"])
   * @param {string} display - Font display strategy (default: "swap")
   * @returns {Promise<void>}
   */
  async loadGoogleFont(fontFamily, weights = ['400'], display = 'swap') {
    const fontKey = `google:${fontFamily}:${weights.join(',')}`;
    
    if (this.loadedFonts.has(fontKey)) {
      return; // Already loaded
    }

    // Create Google Fonts URL
    const weightsParam = weights.join(';');
    const familyParam = fontFamily.replace(/\s+/g, '+');
    const url = `https://fonts.googleapis.com/css2?family=${familyParam}:wght@${weightsParam}&display=${display}`;

    return this.loadFontLink(url, fontKey);
  }

  /**
   * Load a font from a URL
   * @param {string} url - URL to the font CSS file
   * @param {string} key - Unique key for this font
   * @returns {Promise<void>}
   */
  async loadFontLink(url, key) {
    if (this.loadedFonts.has(key)) {
      return;
    }

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.onload = () => {
        this.loadedFonts.add(key);
        this.fontLinks.set(key, link);
        resolve();
      };
      link.onerror = () => {
        reject(new Error(`Failed to load font from ${url}`));
      };
      document.head.appendChild(link);
    });
  }

  /**
   * Load a local font using @font-face
   * @param {string} fontFamily - Font family name
   * @param {object} fontFace - Font face configuration
   * @param {string} fontFace.src - Font source URL(s)
   * @param {string} fontFace.weight - Font weight
   * @param {string} fontFace.style - Font style
   * @returns {Promise<void>}
   */
  async loadLocalFont(fontFamily, fontFace) {
    const fontKey = `local:${fontFamily}:${fontFace.weight || '400'}`;
    
    if (this.loadedFonts.has(fontKey)) {
      return;
    }

    return new Promise((resolve, reject) => {
      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-family: '${fontFamily}';
          src: ${fontFace.src};
          font-weight: ${fontFace.weight || '400'};
          font-style: ${fontFace.style || 'normal'};
          font-display: ${fontFace.display || 'swap'};
        }
      `;
      
      document.head.appendChild(style);
      this.loadedFonts.add(fontKey);
      this.fontLinks.set(fontKey, style);
      
      // Wait for font to load
      if (document.fonts) {
        document.fonts.ready.then(() => resolve());
      } else {
        resolve();
      }
    });
  }

  /**
   * Load fonts from theme configuration
   * @param {object} fonts - Font configuration object
   * @param {object} fonts.google - Google Fonts configuration
   * @param {object} fonts.local - Local fonts configuration
   * @returns {Promise<void>}
   */
  async loadThemeFonts(fonts) {
    const promises = [];

    // Load Google Fonts
    if (fonts.google) {
      Object.entries(fonts.google).forEach(([fontFamily, config]) => {
        const weights = Array.isArray(config) ? config : (config.weights || ['400']);
        const display = config.display || 'swap';
        promises.push(this.loadGoogleFont(fontFamily, weights, display));
      });
    }

    // Load local fonts
    if (fonts.local) {
      Object.entries(fonts.local).forEach(([fontFamily, fontFace]) => {
        promises.push(this.loadLocalFont(fontFamily, fontFace));
      });
    }

    await Promise.allSettled(promises);
  }

  /**
   * Remove a loaded font
   * @param {string} key - Font key
   */
  removeFont(key) {
    const link = this.fontLinks.get(key);
    if (link && link.parentNode) {
      link.parentNode.removeChild(link);
    }
    this.loadedFonts.delete(key);
    this.fontLinks.delete(key);
  }

  /**
   * Clear all loaded fonts
   */
  clear() {
    this.fontLinks.forEach((link) => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    });
    this.loadedFonts.clear();
    this.fontLinks.clear();
  }

  /**
   * Get all loaded font keys
   * @returns {string[]}
   */
  getLoadedFonts() {
    return Array.from(this.loadedFonts);
  }
}

// Singleton instance
const fontManager = new FontManager();

export default fontManager;
export { FontManager };

