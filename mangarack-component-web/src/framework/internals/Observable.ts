import * as mio from '../default';

/**
 * Represents an observable.
 * @internal
 */
export class Observable<T> implements mio.IObservable<T> {
  private _observers: mio.IObservableObserver<T>[];

  /**
   * Initializes a new instance of the Observable class.
   */
  public constructor() {
    this._observers = [];
  }

  /**
   * Notifies each observer.
   * @param state The state.
   */
  public notify(state: T): void {
    for (let observer of this._observers) {
      observer(state);
    }
  }

  /**
   * Registers an observer.
   * @param observer The observer.
   */
  public register(observer: mio.IObservableObserver<T>): void {
    this._observers.push(observer);
  }

  /**
   * Unregisters an observer.
   * @param observer The observer.
   */
  public unregister(observer: mio.IObservableObserver<T>): void {
    let index = this._observers.indexOf(observer);
    if (index !== -1) {
      this._observers.splice(index, 1);
    }
  }
}
