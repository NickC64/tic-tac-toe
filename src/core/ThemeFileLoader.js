/**
 * Utility for loading and parsing theme files
 * Supports JSON format (YAML can be added later if needed)
 */

/**
 * Parse a theme file (JSON format)
 * @param {string|File} fileOrContent - File object or JSON string
 * @returns {Promise<object>} Parsed theme data
 */
export async function loadThemeFile(fileOrContent) {
  let content;
  
  if (fileOrContent instanceof File) {
    // Read file
    content = await fileOrContent.text();
  } else if (typeof fileOrContent === 'string') {
    // Already a string
    content = fileOrContent;
  } else {
    throw new Error('Invalid file or content provided');
  }

  try {
    const themeData = JSON.parse(content);
    return validateThemeData(themeData);
  } catch (error) {
    throw new Error(`Failed to parse theme file: ${error.message}`);
  }
}

/**
 * Validate theme data structure
 * @param {object} data - Theme data to validate
 * @returns {object} Validated theme data
 */
function validateThemeData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Theme file must be a valid JSON object');
  }

  // Check for required color variants
  if (!data.dark && !data.light) {
    throw new Error('Theme file must contain at least one of: "dark" or "light" color sets');
  }

  // Validate color sets
  if (data.dark && typeof data.dark !== 'object') {
    throw new Error('"dark" must be an object with CSS custom properties');
  }

  if (data.light && typeof data.light !== 'object') {
    throw new Error('"light" must be an object with CSS custom properties');
  }

  // Ensure color properties start with --
  const validateColorSet = (colorSet, variant) => {
    const invalidProps = Object.keys(colorSet).filter(key => !key.startsWith('--'));
    if (invalidProps.length > 0) {
      console.warn(`Warning: ${variant} color set contains invalid properties (should start with --):`, invalidProps);
    }
  };

  if (data.dark) validateColorSet(data.dark, 'dark');
  if (data.light) validateColorSet(data.light, 'light');

  // Validate fonts if present
  if (data.fonts) {
    if (typeof data.fonts !== 'object') {
      throw new Error('"fonts" must be an object');
    }

    // Validate Google Fonts
    if (data.fonts.google && typeof data.fonts.google !== 'object') {
      throw new Error('"fonts.google" must be an object');
    }

    // Validate local fonts
    if (data.fonts.local && typeof data.fonts.local !== 'object') {
      throw new Error('"fonts.local" must be an object');
    }

    // Validate font properties
    if (data.fonts.properties && typeof data.fonts.properties !== 'object') {
      throw new Error('"fonts.properties" must be an object with CSS custom properties');
    }
  }

  return {
    name: data.name || 'Imported Theme',
    description: data.description || '',
    author: data.author || '',
    version: data.version || '1.0.0',
    dark: data.dark || {},
    light: data.light || {},
    fonts: data.fonts || {},
    ...data, // Include any additional properties
  };
}

/**
 * Export current theme to a downloadable file
 * @param {object} themeData - Theme data to export
 * @param {string} filename - Name for the exported file
 */
export function exportThemeFile(themeData, filename = 'theme.json') {
  const json = JSON.stringify(themeData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Create a theme file template
 * @returns {object} Template theme data
 */
export function createThemeTemplate() {
  return {
    name: 'Custom Theme',
    description: 'A custom theme for Tic Tac Toe',
    author: '',
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
      // Google Fonts configuration
      google: {
        // Example: 'Roboto': ['400', '700'], // Load weights 400 and 700
        // Example: 'Open Sans': { weights: ['400', '600', '700'], display: 'swap' }
      },
      // Local fonts configuration
      local: {
        // Example: 'Custom Font': {
        //   src: "url('/fonts/custom-font.woff2') format('woff2')",
        //   weight: '400',
        //   style: 'normal',
        //   display: 'swap'
        // }
      },
      // Font CSS custom properties
      properties: {
        // '--font-body': "'Roboto Slab', sans-serif",
        // '--font-heading': "'Caprasimo', cursive",
        // '--font-mono': "'Roboto Slab', monospace"
      }
    }
  };
}

