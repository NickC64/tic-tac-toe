/**
 * Centralized persistence layer.
 * Currently backed by localStorage, but can be swapped for server APIs later.
 */

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function safeParse(json, fallback) {
  try {
    return json ? JSON.parse(json) : fallback;
  } catch {
    return fallback;
  }
}

// Theme preferences
export function saveThemePreference(name, isLightMode) {
  if (!isBrowser) return;
  window.localStorage.setItem('theme', name);
  window.localStorage.setItem('themeLightMode', isLightMode.toString());
}

export function loadThemePreference(defaultTheme = 'dark') {
  if (!isBrowser) {
    return { theme: defaultTheme, isLightMode: false };
  }
  const theme = window.localStorage.getItem('theme') || defaultTheme;
  const isLightMode = window.localStorage.getItem('themeLightMode') === 'true';
  return { theme, isLightMode };
}

// Imported themes
const IMPORTED_THEMES_KEY = 'importedThemes';

export function loadImportedThemes() {
  if (!isBrowser) return {};
  const raw = window.localStorage.getItem(IMPORTED_THEMES_KEY);
  return safeParse(raw, {});
}

export function saveImportedThemes(themesObject) {
  if (!isBrowser) return;
  window.localStorage.setItem(IMPORTED_THEMES_KEY, JSON.stringify(themesObject));
}

// Piece images
const PIECE_IMAGES_KEY = 'pieceImages';

export function loadPieceImages() {
  if (!isBrowser) return {};
  const raw = window.localStorage.getItem(PIECE_IMAGES_KEY);
  return safeParse(raw, {});
}

export function savePieceImages(imageMap) {
  if (!isBrowser) return;
  if (!imageMap || Object.keys(imageMap).length === 0) {
    window.localStorage.removeItem(PIECE_IMAGES_KEY);
    return;
  }
  window.localStorage.setItem(PIECE_IMAGES_KEY, JSON.stringify(imageMap));
}

// Sound settings
const SOUNDS_ENABLED_KEY = 'soundsEnabled';
const SOUNDS_VOLUME_KEY = 'soundsVolume';

export function loadSoundSettings() {
  if (!isBrowser) {
    return { enabled: true, volume: 0.5 };
  }

  const enabledRaw = window.localStorage.getItem(SOUNDS_ENABLED_KEY);
  const volumeRaw = window.localStorage.getItem(SOUNDS_VOLUME_KEY);

  const enabled = enabledRaw !== null ? enabledRaw === 'true' : true;
  const volume = volumeRaw !== null ? parseFloat(volumeRaw) : 0.5;

  return {
    enabled: Number.isFinite(volume) ? enabled : true,
    volume: Number.isFinite(volume) ? Math.max(0, Math.min(1, volume)) : 0.5,
  };
}

export function saveSoundEnabled(enabled) {
  if (!isBrowser) return;
  window.localStorage.setItem(SOUNDS_ENABLED_KEY, enabled.toString());
}

export function saveSoundVolume(volume) {
  if (!isBrowser) return;
  const clamped = Math.max(0, Math.min(1, volume));
  window.localStorage.setItem(SOUNDS_VOLUME_KEY, clamped.toString());
}


