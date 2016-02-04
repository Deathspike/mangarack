'use strict';
import * as mio from '../default';
let items: {[key: string]: string} = {};

/**
 * Represents a store service.
 */
export var storeService: mio.IStoreService = {
  /**
   * Gets the store item with the key as a boolean.
   * @param key The key.
   * @return The store item.
   */
  getBoolean: function(key: string): boolean {
    return /^on|true|yes|1$/.test(storeService.getString(key));
  },

  /**
   * Gets the store item with the key as a number, or 0.
   * @param key The key.
   * @return The store item.
   */
  getNumber: function(key: string): number {
    return parseInt(storeService.getString(key)) || 0;
  },

  /**
   * Gets the store item with the key as a string.
   * @param key The key.
   * @return The store item.
   */
  getString: function(key: string): string {
    return items[key] || '';
  },

  /**
   * Sets the store item with the key and value.
   * @param key The key.
   * @param value The value.
   */
  set: function(key: string, value: string): void {
    items[key] = value;
  }
};
