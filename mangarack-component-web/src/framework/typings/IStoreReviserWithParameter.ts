/**
 * Represents a store reviser with parameter.
 */
export interface IStoreReviserWithParameter<TState, TRevision> {
  /**
   * Occurs when the store dispatches an action for the reviser.
   * @param state The state.
   * @param revision The revision.
   */
  (state: TState, revision: TRevision): PromiseLike<void>|void;
}
