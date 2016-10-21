import * as mio from './default';

/**
 * Creates a promise and invokes the action with a callback.
 * @param action The action.
 * @return The promise.
 */
export function promise<T>(action: (callback: (error?: any, value?: T) => void) => void): Promise<mio.IOption<T>> {
  return new Promise<mio.IOption<T>>((resolve, reject) => {
    try {
      action((error?: any, value?: T) => {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Provides a trackable method with which to define an unsafe typedefinition.
 * @param value The value.
 * @return The value
 */
export function unsafe<T>(value: any): T {
  return value as T;
}
