/**
 * Represents a store reviser.
 */
export interface IStoreReviser<TState> {
  /**
   * Occurs when the store dispatches an action for the reviser.
   * @param state The state.
   */
  (state: TState): PromiseLike<void>|void;
}
