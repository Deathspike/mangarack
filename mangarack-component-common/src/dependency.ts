'use strict';
let dependencies: {[key: string]: any} = {};
let resolvers: {[key: string]: () => any} = {};

/**
 * Represents the dependency helper.
 */
export let dependency = {
  /**
   * Gets the dependency resolver with the key.
   * @param key The key.
   * @return The dependency resolver.
   */
  get: function<T>(key: string): () => T {
    if (!resolvers[key]) {
      let resolved: T;
      resolvers[key] = () => {
        if (!resolved && !dependencies[key]) {
          throw new Error(`Dependency does not exist: ${key}`);
        }
        return resolved || (resolved = dependencies[key]);
      };
    }
    return resolvers[key];
  },

  /**
   * Sets the dependency with the key.
   * @param key The key.
   * @param value The value.
   */
  set: function<T>(key: string, value: T): void {
    if (dependencies[key]) {
      throw new Error(`Dependency already exists: ${key}`);
    } else {
      dependencies[key] = value;
    }
  }
};
