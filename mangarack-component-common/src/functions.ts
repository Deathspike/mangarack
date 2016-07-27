/* tslint:disable:no-null-keyword */
import * as mio from './default';

/**
 * Creates an option value.
 * @param value= The value.
 * @return The option value.
 */
export function option<T>(value?: T): mio.IOption<T> {
  if (typeof value === 'boolean') {
    return {hasValue: true, value: value};
  } else if (typeof value === 'number') {
    let hasValue = isFinite(value as any);
    return {hasValue: hasValue, value: hasValue ? value : undefined};
  } else if (typeof value === 'undefined') {
    return {hasValue: false, value: undefined};
  } else {
    let hasValue = value != null;
    return {hasValue: hasValue, value: hasValue ? value : undefined};
  }
}

/**
 * Determines whether the value is null.
 * @param value The value.
 * @return Indicates whether the value is null.
 */
export function isNull<T>(value: any): value is void {
  return value === null || value === undefined;
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
          resolve(mio.option(value));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}
