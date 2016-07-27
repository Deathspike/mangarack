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
