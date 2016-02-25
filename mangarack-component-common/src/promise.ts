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
          resolve(mio.option(value));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}
