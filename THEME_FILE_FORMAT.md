# Theme File Format

The Tic Tac Toe game supports importing custom themes via JSON files. Each theme file contains color definitions for both light and dark modes.

## File Format

Theme files are JSON files with the following structure:

```json
{
  "name": "Theme Name",
  "description": "Optional description of the theme",
  "author": "Optional author name",
  "version": "1.0.0",
  "dark": {
    "--bg-dark": "oklch(0.1 0.045 220)",
    "--bg": "oklch(0.15 0.045 220)",
    "--bg-light": "oklch(0.2 0.045 220)",
    "--text": "oklch(0.96 0.09 220)",
    "--text-muted": "oklch(0.76 0.09 220)",
    "--highlight": "oklch(0.5 0.09 220)",
    "--border": "oklch(0.4 0.09 220)",
    "--border-muted": "oklch(0.3 0.09 220)",
    "--primary": "oklch(0.76 0.1 220)",
    "--secondary": "oklch(0.76 0.1 40)",
    "--danger": "oklch(0.7 0.09 30)",
    "--warning": "oklch(0.7 0.09 100)",
    "--success": "oklch(0.7 0.09 160)",
    "--info": "oklch(0.7 0.09 260)"
  },
  "light": {
    "--bg-dark": "oklch(0.92 0.045 220)",
    "--bg": "oklch(0.96 0.045 220)",
    "--bg-light": "oklch(1 0.045 220)",
    "--text": "oklch(0.15 0.09 220)",
    "--text-muted": "oklch(0.4 0.09 220)",
    "--highlight": "oklch(1 0.09 220)",
    "--border": "oklch(0.6 0.09 220)",
    "--border-muted": "oklch(0.7 0.09 220)",
    "--primary": "oklch(0.4 0.1 220)",
    "--secondary": "oklch(0.4 0.1 40)",
    "--danger": "oklch(0.5 0.09 30)",
    "--warning": "oklch(0.5 0.09 100)",
    "--success": "oklch(0.5 0.09 160)",
    "--info": "oklch(0.5 0.09 260)"
  }
}
```

## Required Fields

- **`dark`** or **`light`** (at least one required): Object containing CSS custom properties for the color scheme
  - All properties must start with `--` (CSS custom property syntax)
  - Values can be in any valid CSS color format (oklch, rgb, hex, etc.)

## Optional Fields

- **`fonts`** (optional): Object containing font configuration
  - **`google`**: Object mapping Google Font names to their weights
  - **`local`**: Object mapping local font names to their font-face configuration
  - **`properties`**: Object containing CSS custom properties for font families

## Optional Metadata Fields

- **`name`**: Display name for the theme (defaults to "Imported Theme")
- **`description`**: Description of the theme
- **`author`**: Author of the theme
- **`version`**: Version number (defaults to "1.0.0")

## Color Properties

The following CSS custom properties are used throughout the application:

### Background Colors
- `--bg-dark`: Darkest background (page background)
- `--bg`: Main background (card backgrounds)
- `--bg-light`: Lightest background (input fields, list items)

### Text Colors
- `--text`: Primary text color
- `--text-muted`: Secondary/muted text color

### Accent Colors
- `--primary`: Primary accent color (buttons, highlights)
- `--secondary`: Secondary accent color
- `--highlight`: Highlight color

### Border Colors
- `--border`: Primary border color
- `--border-muted`: Muted border color

### Status Colors
- `--danger`: Error/danger color
- `--warning`: Warning color
- `--success`: Success color
- `--info`: Info color

## Color Format

The application uses the `oklch()` color format by default, but you can use any valid CSS color format:

- `oklch(lightness chroma hue)` - Recommended for better color consistency
- `rgb(r, g, b)` or `rgba(r, g, b, a)`
- `#hex` or `#hexalpha`
- `hsl(h, s%, l%)` or `hsla(h, s%, l%, a)`

## Font Configuration

The `fonts` object supports three types of font loading:

### Google Fonts

Load fonts from Google Fonts:

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

- Font names should match Google Fonts exactly
- Weights can be an array of strings or an object with `weights` and optional `display` property
- Display options: `auto`, `block`, `swap`, `fallback`, `optional`

### Local Fonts

Load fonts from local files using `@font-face`:

```json
{
  "fonts": {
    "local": {
      "Custom Font": {
        "src": "url('/fonts/custom-font.woff2') format('woff2'), url('/fonts/custom-font.woff') format('woff')",
        "weight": "400",
        "style": "normal",
        "display": "swap"
      }
    }
  }
}
```

- `src`: Font source URL(s) with format hints
- `weight`: Font weight (e.g., "400", "700", "normal", "bold")
- `style`: Font style ("normal", "italic", "oblique")
- `display`: Font display strategy (default: "swap")

### Font Properties

Set CSS custom properties for font families:

```json
{
  "fonts": {
    "properties": {
      "--font-body": "'Roboto', sans-serif",
      "--font-heading": "'Open Sans', sans-serif",
      "--font-mono": "'Courier New', monospace"
    }
  }
}
```

- Properties must start with `--font-`
- Values should be valid CSS font-family values
- These properties are applied to the document root

## Example Theme Files

### Minimal Theme (Dark Only)
```json
{
  "name": "Dark Only Theme",
  "dark": {
    "--bg-dark": "#000000",
    "--bg": "#1a1a1a",
    "--bg-light": "#2a2a2a",
    "--text": "#ffffff",
    "--primary": "#00ff00"
  }
}
```

### Theme with Google Fonts
```json
{
  "name": "Theme with Fonts",
  "dark": { /* colors */ },
  "light": { /* colors */ },
  "fonts": {
    "google": {
      "Inter": ["400", "600", "700"],
      "Playfair Display": ["400", "700"]
    },
    "properties": {
      "--font-body": "'Inter', sans-serif",
      "--font-heading": "'Playfair Display', serif"
    }
  }
}
```

### Full Theme (Both Modes + Fonts)
See `public/theme-template.json` for a complete example.

## How to Use

1. **Create a theme file**: Use the template or create your own JSON file
2. **Import in Settings**: Go to Settings page → Theme section → Import Theme File
3. **Select theme**: Choose your imported theme from the dropdown
4. **Toggle mode**: Use the theme toggle button to switch between light/dark variants
5. **Export theme**: Export your current theme to share or backup

## Notes

- Imported themes are saved in browser localStorage
- Themes persist across browser sessions
- You can remove imported themes from the Settings page
- Built-in themes (dark, light) cannot be removed
- The theme toggle button works with imported themes, switching between their light and dark variants

