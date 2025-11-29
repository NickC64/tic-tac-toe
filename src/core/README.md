# Core Architecture - Design Patterns

This directory contains the core architecture using design patterns to support extensibility for:
1. Custom board pieces
2. Custom themes
3. Custom sound effects

## Design Patterns Used

### 1. Factory Pattern - Board Pieces (`PieceFactory.js`)

The Factory pattern allows easy creation of different board piece types.

**How to add a custom piece type:**

```javascript
// Create a new piece component
import BasePiece from './pieces/BasePiece.jsx';

export default function CustomPiece({ symbol, className, style, customProp }) {
  return (
    <div className={className} style={style}>
      {/* Your custom rendering logic */}
      <img src={`/pieces/${symbol}.png`} alt={symbol} />
    </div>
  );
}

// Register it
import pieceFactory from './core/PieceFactory.js';
import CustomPiece from './pieces/CustomPiece.jsx';

pieceFactory.register('custom', CustomPiece);

// Use it in GameConfig
const { setPieceType, setPieceConfig } = useGameConfig();
setPieceType('custom');
setPieceConfig({ customProp: 'value' });
```

**Available piece types:**
- `text` - Simple text rendering (default X, O)
- `icon` - Icon-based rendering with icon map

### 2. Strategy Pattern - Themes (`ThemeManager.js`)

The Strategy pattern allows switching between different theme implementations.

**How to add a custom theme:**

```javascript
import { BaseTheme } from './themes/BaseTheme.js';

export class CustomTheme extends BaseTheme {
  constructor() {
    super('custom');
  }

  apply() {
    document.documentElement.classList.add('theme-custom');
    // Set CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--primary', '#ff0000');
    // ... set other properties
  }

  remove() {
    document.documentElement.classList.remove('theme-custom');
  }

  getConfig() {
    return {
      name: 'custom',
      colors: {
        '--primary': '#ff0000',
        // ... other colors
      }
    };
  }
}

// Register it
import themeManager from './core/ThemeManager.js';
import { CustomTheme } from './themes/CustomTheme.js';

themeManager.register('custom', new CustomTheme());

// Use it
const { setTheme } = useGameConfig();
setTheme('custom');
```

**Available themes:**
- `dark` - Dark theme (default)
- `light` - Light theme

### 3. Observer Pattern - Events (`EventBus.js`)

The Observer pattern allows decoupled event handling for sound effects, animations, etc.

**How to listen to game events:**

```javascript
import eventBus, { GameEvents } from './core/EventBus.js';

// Subscribe to an event
const unsubscribe = eventBus.on(GameEvents.MOVE, (data) => {
  console.log('Move made:', data);
  // Your custom logic here
});

// Unsubscribe when done
unsubscribe();

// Available events:
// - GameEvents.MOVE - When a move is made
// - GameEvents.WIN - When a player wins
// - GameEvents.DRAW - When game ends in a draw
// - GameEvents.RESTART - When game restarts
// - GameEvents.SQUARE_CLICK - When a square is clicked
// - GameEvents.BOT_THINKING - When bot starts thinking
// - GameEvents.BOT_MOVE - When bot makes a move
```

### 4. Sound Manager (`SoundManager.js`)

The SoundManager uses the EventBus to play sounds on game events.

**How to add custom sounds:**

```javascript
import soundManager from './core/SoundManager.js';
import { GameEvents } from './core/EventBus.js';

// Register sounds for events
soundManager.registerSound(GameEvents.MOVE, '/sounds/move.mp3');
soundManager.registerSound(GameEvents.WIN, '/sounds/win.mp3');
soundManager.registerSound(GameEvents.DRAW, '/sounds/draw.mp3');

// Control sounds
const { soundsEnabled, setSoundsEnabled, setSoundVolume } = useGameConfig();
setSoundsEnabled(true);
setSoundVolume(0.7);
```

## Usage in Components

### Using GameConfig Hook

```javascript
import { useGameConfig } from '../core/GameConfig.jsx';

function MyComponent() {
  const {
    // Pieces
    pieceType,
    setPieceType,
    getPieceComponent,
    
    // Themes
    theme,
    setTheme,
    toggleTheme,
    
    // Sounds
    soundsEnabled,
    setSoundsEnabled,
    soundVolume,
    setSoundVolume,
  } = useGameConfig();

  return (
    <div>
      {getPieceComponent('X')}
    </div>
  );
}
```

## Architecture Benefits

1. **Extensibility**: Easy to add new piece types, themes, and sound effects
2. **Decoupling**: Components don't need to know about specific implementations
3. **Testability**: Each pattern can be tested independently
4. **Maintainability**: Clear separation of concerns
5. **Flexibility**: Can swap implementations without changing component code

