import * as mio from '../default';

/**
 * Represents a store.
 */
export interface IStore<TState> extends mio.IObservable<TState> {
  /**
   * Dispatches the action.
   * @param The action.
   */
  dispatch<TRevision>(action: mio.IAction<TRevision>): void;

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
  reviser<TRevision>(name: string, reviser: mio.IStoreReviserWithParameter<TState, TRevision>): (revision: TRevision) => PromiseLike<void>|void;
}
