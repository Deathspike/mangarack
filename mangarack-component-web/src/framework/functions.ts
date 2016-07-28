/* tslint:disable:no-null-keyword */
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
export function isNull(value: any): value is null | undefined {
  return value === null || value === undefined;
}
