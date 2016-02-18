import * as mio from './default';

/**
 * Creates a promise and invokes the runnable with a callback.
 * @param runnable The runnable.
 * @return The promise.
 */
export function promise<T>(runnable: (callback: (error?: any, value?: T) => void) => void): Promise<mio.IOption<T>> {
  return new Promise<mio.IOption<T>>((resolve, reject) => {
    runnable((error: any, value: T) => {
      if (error) {
        reject(error);
      } else {
        resolve(mio.option(value));
      }
    });
  });
}
