/**
 * Sound Manager using Observer pattern (EventBus)
 * Handles sound effects for game events
 */
import eventBus, { GameEvents } from './EventBus.js';
import { loadSoundSettings, saveSoundEnabled, saveSoundVolume } from './storage.js';

class SoundManager {
  constructor() {
    this.sounds = new Map();
    this.enabled = true;
    this.volume = 0.5;
    this.eventUnsubscribers = [];
  }

  /**
   * Register a sound for an event
   * @param {string} eventType - Event type from GameEvents
   * @param {string|Audio} soundSource - URL or Audio object
   */
  registerSound(eventType, soundSource) {
    if (!this.sounds.has(eventType)) {
      this.sounds.set(eventType, []);
    }
    
    const audio = typeof soundSource === 'string' 
      ? new Audio(soundSource) 
      : soundSource;
    
    this.sounds.get(eventType).push(audio);
  }

  /**
   * Play a sound for an event
   * @param {string} eventType - Event type
   */
  playSound(eventType) {
    if (!this.enabled) return;

    const audioList = this.sounds.get(eventType);
    if (!audioList || audioList.length === 0) return;

    // Play a random sound from the list if multiple are registered
    const audio = audioList[Math.floor(Math.random() * audioList.length)];
    const sound = audio.cloneNode ? audio.cloneNode() : new Audio(audio.src);
    
    sound.volume = this.volume;
    sound.play().catch(error => {
      console.warn(`Could not play sound for ${eventType}:`, error);
    });
  }

  /**
   * Start listening to game events
   */
  start() {
    // Subscribe to all game events
    Object.values(GameEvents).forEach(eventType => {
      const unsubscribe = eventBus.on(eventType, () => {
        this.playSound(eventType);
      });
      this.eventUnsubscribers.push(unsubscribe);
    });
  }

  /**
   * Stop listening to game events
   */
  stop() {
    this.eventUnsubscribers.forEach(unsubscribe => unsubscribe());
    this.eventUnsubscribers = [];
  }

  /**
   * Enable/disable sounds
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    saveSoundEnabled(enabled);
  }

  /**
   * Set volume
   * @param {number} volume - Volume between 0 and 1
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    saveSoundVolume(this.volume);
  }

  /**
   * Initialize from localStorage
   */
  initialize() {
    const settings = loadSoundSettings();
    this.enabled = settings.enabled;
    this.volume = settings.volume;

    this.start();
  }

  /**
   * Clear all registered sounds
   */
  clear() {
    this.sounds.clear();
  }
}

// Singleton instance
const soundManager = new SoundManager();

export default soundManager;
export { SoundManager };

