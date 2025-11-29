/**
 * Observer Pattern for game events
 * Allows decoupled event handling for sound effects, animations, etc.
 */
class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Subscribe to an event
   * @param {string} eventType - The event type to listen for
   * @param {Function} callback - Callback function to execute
   * @returns {Function} Unsubscribe function
   */
  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    
    const callbacks = this.listeners.get(eventType);
    callbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Subscribe to an event once
   * @param {string} eventType - The event type to listen for
   * @param {Function} callback - Callback function to execute
   */
  once(eventType, callback) {
    const unsubscribe = this.on(eventType, (...args) => {
      callback(...args);
      unsubscribe();
    });
    return unsubscribe;
  }

  /**
   * Emit an event
   * @param {string} eventType - The event type
   * @param {*} data - Data to pass to listeners
   */
  emit(eventType, data) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Remove all listeners for an event type
   * @param {string} eventType - The event type
   */
  off(eventType) {
    this.listeners.delete(eventType);
  }

  /**
   * Remove all listeners
   */
  clear() {
    this.listeners.clear();
  }

  /**
   * Get all registered event types
   * @returns {string[]}
   */
  getEventTypes() {
    return Array.from(this.listeners.keys());
  }
}

// Singleton instance
const eventBus = new EventBus();

// Export event type constants
export const GameEvents = {
  MOVE: 'game:move',
  WIN: 'game:win',
  DRAW: 'game:draw',
  RESTART: 'game:restart',
  SQUARE_CLICK: 'game:square:click',
  BOT_THINKING: 'game:bot:thinking',
  BOT_MOVE: 'game:bot:move',
};

export default eventBus;
export { EventBus };

