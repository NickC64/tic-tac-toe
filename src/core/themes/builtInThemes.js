/**
 * Built-in theme definitions
 * These themes are available by default
 */

export const builtInThemeData = {
  purple: {
    name: "Purple Dream Theme",
    description: "A vibrant purple-themed design with elegant typography",
    author: "Built-in",
    version: "1.0.0",
    dark: {
      "--bg-dark": "oklch(0.12 0.08 280)",
      "--bg": "oklch(0.18 0.08 280)",
      "--bg-light": "oklch(0.25 0.08 280)",
      "--text": "oklch(0.95 0.05 280)",
      "--text-muted": "oklch(0.75 0.05 280)",
      "--highlight": "oklch(0.6 0.15 280)",
      "--border": "oklch(0.45 0.1 280)",
      "--border-muted": "oklch(0.35 0.08 280)",
      "--primary": "oklch(0.75 0.2 280)",
      "--secondary": "oklch(0.7 0.15 320)",
      "--danger": "oklch(0.65 0.15 15)",
      "--warning": "oklch(0.7 0.15 70)",
      "--success": "oklch(0.7 0.15 150)",
      "--info": "oklch(0.7 0.15 240)"
    },
    light: {
      "--bg-dark": "oklch(0.95 0.03 280)",
      "--bg": "oklch(0.98 0.02 280)",
      "--bg-light": "oklch(1 0.01 280)",
      "--text": "oklch(0.2 0.05 280)",
      "--text-muted": "oklch(0.45 0.04 280)",
      "--highlight": "oklch(0.5 0.1 280)",
      "--border": "oklch(0.65 0.08 280)",
      "--border-muted": "oklch(0.75 0.05 280)",
      "--primary": "oklch(0.5 0.2 280)",
      "--secondary": "oklch(0.45 0.15 320)",
      "--danger": "oklch(0.55 0.15 15)",
      "--warning": "oklch(0.6 0.15 70)",
      "--success": "oklch(0.6 0.15 150)",
      "--info": "oklch(0.6 0.15 240)"
    },
    fonts: {
      google: {
        "Poppins": ["400", "600", "700"],
        "Merriweather": ["400", "700"]
      },
      properties: {
        "--font-body": "'Poppins', -apple-system, BlinkMacSystemFont, sans-serif",
        "--font-heading": "'Merriweather', Georgia, serif",
        "--font-mono": "'Courier New', monospace"
      }
    }
  },
  ocean: {
    name: "Ocean Breeze Theme",
    description: "A calming blue-green theme inspired by the ocean",
    author: "Built-in",
    version: "1.0.0",
    dark: {
      "--bg-dark": "oklch(0.15 0.05 200)",
      "--bg": "oklch(0.2 0.05 200)",
      "--bg-light": "oklch(0.25 0.05 200)",
      "--text": "oklch(0.92 0.03 200)",
      "--text-muted": "oklch(0.7 0.03 200)",
      "--highlight": "oklch(0.55 0.12 180)",
      "--border": "oklch(0.4 0.08 200)",
      "--border-muted": "oklch(0.3 0.06 200)",
      "--primary": "oklch(0.7 0.15 200)",
      "--secondary": "oklch(0.65 0.12 180)",
      "--danger": "oklch(0.65 0.15 10)",
      "--warning": "oklch(0.7 0.15 80)",
      "--success": "oklch(0.7 0.15 160)",
      "--info": "oklch(0.7 0.15 220)"
    },
    light: {
      "--bg-dark": "oklch(0.94 0.02 200)",
      "--bg": "oklch(0.97 0.02 200)",
      "--bg-light": "oklch(0.99 0.01 200)",
      "--text": "oklch(0.18 0.04 200)",
      "--text-muted": "oklch(0.42 0.03 200)",
      "--highlight": "oklch(0.5 0.1 180)",
      "--border": "oklch(0.62 0.06 200)",
      "--border-muted": "oklch(0.72 0.04 200)",
      "--primary": "oklch(0.45 0.15 200)",
      "--secondary": "oklch(0.4 0.12 180)",
      "--danger": "oklch(0.55 0.15 10)",
      "--warning": "oklch(0.6 0.15 80)",
      "--success": "oklch(0.6 0.15 160)",
      "--info": "oklch(0.6 0.15 220)"
    },
    fonts: {
      google: {
        "Nunito": ["400", "600", "700"],
        "Lora": ["400", "700"]
      },
      properties: {
        "--font-body": "'Nunito', -apple-system, BlinkMacSystemFont, sans-serif",
        "--font-heading": "'Lora', Georgia, serif",
        "--font-mono": "'Courier New', monospace"
      }
    }
  },
  sunset: {
    name: "Sunset Warmth Theme",
    description: "A warm orange-red theme with cozy vibes",
    author: "Built-in",
    version: "1.0.0",
    dark: {
      "--bg-dark": "oklch(0.1 0.06 30)",
      "--bg": "oklch(0.16 0.06 30)",
      "--bg-light": "oklch(0.22 0.06 30)",
      "--text": "oklch(0.94 0.04 30)",
      "--text-muted": "oklch(0.74 0.04 30)",
      "--highlight": "oklch(0.6 0.18 40)",
      "--border": "oklch(0.42 0.1 30)",
      "--border-muted": "oklch(0.32 0.08 30)",
      "--primary": "oklch(0.72 0.2 40)",
      "--secondary": "oklch(0.68 0.18 50)",
      "--danger": "oklch(0.65 0.18 20)",
      "--warning": "oklch(0.7 0.18 60)",
      "--success": "oklch(0.7 0.15 140)",
      "--info": "oklch(0.7 0.15 220)"
    },
    light: {
      "--bg-dark": "oklch(0.93 0.03 30)",
      "--bg": "oklch(0.97 0.02 30)",
      "--bg-light": "oklch(0.99 0.01 30)",
      "--text": "oklch(0.19 0.05 30)",
      "--text-muted": "oklch(0.44 0.04 30)",
      "--highlight": "oklch(0.52 0.12 40)",
      "--border": "oklch(0.64 0.08 30)",
      "--border-muted": "oklch(0.74 0.05 30)",
      "--primary": "oklch(0.48 0.2 40)",
      "--secondary": "oklch(0.44 0.18 50)",
      "--danger": "oklch(0.55 0.18 20)",
      "--warning": "oklch(0.6 0.18 60)",
      "--success": "oklch(0.6 0.15 140)",
      "--info": "oklch(0.6 0.15 220)"
    },
    fonts: {
      google: {
        "Montserrat": ["400", "600", "700"],
        "Crimson Text": ["400", "600", "700"]
      },
      properties: {
        "--font-body": "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
        "--font-heading": "'Crimson Text', Georgia, serif",
        "--font-mono": "'Courier New', monospace"
      }
    }
  }
};

