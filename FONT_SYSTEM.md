# Font System Documentation

The theme system now supports custom fonts through the `FontManager` utility. This allows themes to include Google Fonts, local fonts, and custom font properties.

## Features

- **Google Fonts Integration**: Automatically load fonts from Google Fonts
- **Local Font Support**: Load custom fonts from local files
- **Font Properties**: Set CSS custom properties for font families
- **Automatic Loading**: Fonts are loaded when a theme is applied
- **Error Handling**: Graceful fallback if fonts fail to load

## Usage in Theme Files

### Google Fonts

```json
{
  "fonts": {
    "google": {
      "Roboto": ["400", "700"],
      "Open Sans": {
        "weights": ["400", "600", "700"],
        "display": "swap"
      }
    }
  }
}
```

### Local Fonts

```json
{
  "fonts": {
    "local": {
      "My Custom Font": {
        "src": "url('/fonts/myfont.woff2') format('woff2')",
        "weight": "400",
        "style": "normal",
        "display": "swap"
      }
    }
  }
}
```

### Font Properties

```json
{
  "fonts": {
    "properties": {
      "--font-body": "'Roboto', sans-serif",
      "--font-heading": "'Playfair Display', serif",
      "--font-mono": "'Courier New', monospace"
    }
  }
}
```

## Font Manager API

The `FontManager` singleton provides methods for programmatic font loading:

```javascript
import fontManager from './core/FontManager.js';

// Load a Google Font
await fontManager.loadGoogleFont('Roboto', ['400', '700']);

// Load a font from URL
await fontManager.loadFontLink('https://fonts.googleapis.com/css2?family=Inter', 'inter');

// Load a local font
await fontManager.loadLocalFont('Custom Font', {
  src: "url('/fonts/custom.woff2') format('woff2')",
  weight: '400',
  style: 'normal'
});

// Load fonts from theme configuration
await fontManager.loadThemeFonts({
  google: { 'Roboto': ['400', '700'] },
  local: { /* ... */ },
  properties: { /* ... */ }
});
```

## Font Display Strategies

The `display` property controls how fonts are loaded:

- **`auto`**: Browser decides (default)
- **`block`**: Hide text until font loads (FOIT - Flash of Invisible Text)
- **`swap`**: Show fallback immediately, swap when font loads (FOUT - Flash of Unstyled Text) - **Recommended**
- **`fallback`**: Short block period, then swap
- **`optional`**: Only use if available quickly

## Best Practices

1. **Use `swap` display strategy** for better user experience
2. **Limit font weights** - Only load weights you actually use
3. **Prefer WOFF2 format** for local fonts (better compression)
4. **Provide fallbacks** in font-family declarations
5. **Test font loading** - Ensure fonts load correctly before publishing

## Font Loading Flow

1. Theme is imported/selected
2. `ImportedTheme.apply()` is called
3. If theme has fonts, `FontManager.loadThemeFonts()` is called
4. Google Fonts are loaded via `<link>` tags
5. Local fonts are loaded via `@font-face` rules
6. Font properties are applied to document root
7. Theme colors are applied

## Error Handling

If font loading fails:
- Error is logged to console
- Theme still applies (colors work)
- Browser falls back to default fonts
- User experience is not blocked

## Example: Complete Theme with Fonts

```json
{
  "name": "Modern Theme",
  "description": "A modern theme with custom fonts",
  "version": "1.0.0",
  "dark": {
    "--bg-dark": "oklch(0.1 0.045 220)",
    "--text": "oklch(0.96 0.09 220)",
    "--primary": "oklch(0.76 0.1 220)"
  },
  "light": {
    "--bg-dark": "oklch(0.92 0.045 220)",
    "--text": "oklch(0.15 0.09 220)",
    "--primary": "oklch(0.4 0.1 220)"
  },
  "fonts": {
    "google": {
      "Inter": ["400", "600", "700"],
      "Playfair Display": ["400", "700"]
    },
    "properties": {
      "--font-body": "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      "--font-heading": "'Playfair Display', Georgia, serif",
      "--font-mono": "'Courier New', monospace"
    }
  }
}
```

