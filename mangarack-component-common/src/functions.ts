import * as mio from './default';

/**
 * Determines whether the value is valid.
 * @param value The value.
 * @return Indicates whether the value is valid.
 */
export function isOk<T>(value: T | null | undefined): value is T {
  return value != null && (typeof value !== 'number' || isFinite(value as any));
}

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
 * Narrows the type of the value using an unsafe approach. This is used until TypeScript deals with edge cases correctly.
 * @param value The value.
 * @return The narrowed value.
 */
export function unsafe<T>(value: T | null | undefined): T {
  return value as any;
}
