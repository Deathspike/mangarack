import * as fw from './default';
import * as fwInternals from './internals';

/**
 * Creates a store.
 * @param initialState The initial state.
 * @return The store.
 */
export function createStore<T>(initialState: T): fw.IStore<T> {
  return new fwInternals.Store(initialState);
}

/**
 * Determines whether the value is null.
 * @param value The value.
 * @return Indicates whether the value is null.
 */
export function isNull<T>(value: any): value is void {
  return value === null || value === undefined;
}
