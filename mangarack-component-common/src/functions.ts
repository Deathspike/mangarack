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
 * Creates a trackable method with which to define an unsafe promise.
 * @param action The action.
 * @return The promise.
 */
export function promiseUnsafe<T>(action: (callback: (error: any, value: any) => void) => void): Promise<T> {
  return mio.promise<T>(callback => {
    action((error, value) => {
      if (error || !value) {
        callback(error);
      } else {
        callback(undefined, unsafe<T>(value));
      }
    });
  })
}

/**
 * Provides a trackable method with which to define an unsafe type definition.
 * @param value The value.
 * @return The value
 */
export function unsafe<T>(value: any): T {
  return value as T;
}
