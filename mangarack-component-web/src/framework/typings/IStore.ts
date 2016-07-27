import * as mio from '../default';

/**
 * Represents a store.
 */
export interface IStore<TState> extends mio.IObservable<TState> {
  /**
   * Dispatches the action.
   * @param The action.
   */
  dispatch<T>(action: mio.IAction<T>): void;

  /**
   * Dispatches the revision error.
   * @param error The error.
   */
  dispatchError(error: any): void;

  /**
   * Gets the state.
   * @return The state.
   */
  getState(): TState;

  /**
   * Registers the reviser.
   * @param name The name.
   * @param reviser The reviser.
   * @return The revision dispatcher.
   */
  reviser(name: string, reviser: mio.IStoreReviser<TState>): () => void;

  /**
   * Registers the reviser.
   * @param name The name.
   * @param reviser The reviser.
   * @return The revision dispatcher.
   */
  reviser<T>(name: string, reviser: mio.IStoreReviserWithParameter<TState, T>): (revision: T) => PromiseLike<void>|void;

  /**
   * Registers the error handler.
   * @param errorHandler The error handler.
   */
  reviserError(errorHandler: (error: any) => void): void;
}
