import * as mio from '../default';
let items: mio.IDictionary = {};

/**
 * Represents a setting service.
 */
export let settingService = {
  /**
   * Gets the setting with the key as a boolean.
   * @param key The key.
   * @return The store item.
   */
  getBoolean: function(key: string): boolean {
    return /^on|true|yes|1$/.test(settingService.getString(key));
  },

  /**
   * Gets the setting item with the key as a number, or 0.
   * @param key The key.
   * @return The store item.
   */
  getNumber: function(key: string): number {
    return parseFloat(settingService.getString(key)) || 0;
  },

  /**
   * Gets the setting item with the key as a string.
   * @param key The key.
   * @return The store item.
   */
  getString: function(key: string): string {
    return items[key] || '';
  },

  /**
   * Sets the setting item with the key and value.
   * @param key The key.
   * @param value The value.
   */
  set: function(key: string, value: string): void {
    items[key] = value;
  }
};
