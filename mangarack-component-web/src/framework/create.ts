import * as mio from './default';
import * as mioInternal from './module';

/**
 * Creates a store.
 * @param initialState The initial state.
 * @return The store.
 */
export function createStore<T>(initialState: T): mio.IStore<T> {
  return new mioInternal.Store(initialState);
}
