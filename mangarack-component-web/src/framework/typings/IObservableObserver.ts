/**
 * Represents an observable observer.
 */
export interface IObservableObserver<T> {
  /**
   * Occurs when the observable dispatches a state.
   * @param state The state.
   */
  (state: T): void;
}
