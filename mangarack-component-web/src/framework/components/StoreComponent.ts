import * as fw from '../default';

/**
 * Represents a store component.
 */
export abstract class StoreComponent<T> extends fw.StatefulComponent<void, T> {
  private _observer: fw.IObservableObserver<T>;
  private _store: fw.IStore<T>;
  private _timeoutHandle: number;

  /**
   * Initializes a new instance of the StoreComponent class.
   * @param store The store.
   */
  public constructor(store: fw.IStore<T>) {
    super(undefined, store.getState());
    this._observer = this._onNotify.bind(this);
    this._store = store;
    this._timeoutHandle = 0;
  }

  /**
   * Occurs when the component is in the process of being mounted.
   */
  public componentWillMount(): void {
    super.componentWillMount();
    this._store.register(this._observer);
  }

  /**
   * Occurs when the component is in the process of being unmounted.
   */
  public componentWillUnmount(): void {
    this._store.unregister(this._observer);
  }

  /**
   * Occurs when the observable sends a notification about a change in state.
   * @param state The state.
   */
  private _onNotify(state: T): void {
    if (!this._timeoutHandle) {
      this._timeoutHandle = setTimeout(() => {
        this._timeoutHandle = 0;
        this.setState(state);
      }, 1);
    }
  }
}
