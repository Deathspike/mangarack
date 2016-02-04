/**
 * Represents a store service.
 */
export interface IStoreService {
  /**
   * Gets the store item with the key as a boolean.
   * @param key The key.
   * @return The store item.
   */
  getBoolean: (key: string) => boolean;

  /**
   * Gets the store item with the key as a number, or 0.
   * @param key The key.
   * @return The store item.
   */
  getNumber: (key: string) => number;

  /**
   * Gets the store item with the key as a string.
   * @param key The key.
   * @return The store item.
   */
  getString: (key: string) => string;

  /**
   * Sets the store item with the key and value.
   * @param key The key.
   * @param value The value.
   */
  set: (key: string, value: string) => void;
}
