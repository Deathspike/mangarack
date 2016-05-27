import * as fw from '../default';

/**
 * Represents an observable.
 */
export interface IObservable<T> {
  /**
   * Notifies each observer.
   * @param state The state.
   */
  notify(state: T): void;

  /**
   * Registers an observer.
   * @param observer The observer.
   */
  register(observer: fw.IObservableObserver<T>): void;

  /**
   * Unregisters an observer.
   * @param observer The observer.
   */
  unregister(observer: fw.IObservableObserver<T>): void;
}
