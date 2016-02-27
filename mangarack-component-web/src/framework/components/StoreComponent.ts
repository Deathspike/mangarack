import * as mio from '../default';

/**
 * Represents a store component.
 */
export abstract class StoreComponent<T> extends mio.StatefulComponent<{}, T> {
  private _observer: mio.IObservableObserver<T>;
  private _store: mio.IStore<T>;

  /**
   * Initializes a new instance of the StoreComponent class.
   * @param store The store.
   */
  public constructor(store: mio.IStore<T>) {
    super({}, store.getState());
    this._observer = this._onNotify.bind(this);
    this._store = store;
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
  private _onNotify(state: T) {
    this.setState(state);
  }
}
