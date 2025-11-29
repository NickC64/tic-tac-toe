/**
 * Example: Custom Sound Handler
 * Shows how to create a custom sound handler using the EventBus
 */
import eventBus, { GameEvents } from '../EventBus.js';

class CustomSoundHandler {
  constructor() {
    this.sounds = {
      move: new Audio('/sounds/move.mp3'),
      win: new Audio('/sounds/win.mp3'),
      draw: new Audio('/sounds/draw.mp3'),
    };
    this.unsubscribers = [];
  }

  start() {
    // Subscribe to game events
    this.unsubscribers.push(
      eventBus.on(GameEvents.MOVE, () => this.playSound('move')),
      eventBus.on(GameEvents.WIN, () => this.playSound('win')),
      eventBus.on(GameEvents.DRAW, () => this.playSound('draw')),
    );
  }

  stop() {
    this.unsubscribers.forEach(unsub => unsub());
    this.unsubscribers = [];
  }

  playSound(soundName) {
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0; // Reset to start
      sound.play().catch(err => console.warn('Could not play sound:', err));
    }
  }
}

// To use this:
// const soundHandler = new CustomSoundHandler();
// soundHandler.start();
// // Later: soundHandler.stop();

export default CustomSoundHandler;

