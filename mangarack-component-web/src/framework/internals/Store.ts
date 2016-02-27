import * as mio from '../default';
import * as mioInternal from '../module';

/**
 * Represents a store.
 * @internal
 */
export class Store<TState> extends mioInternal.Observable<TState> implements mio.IStore<TState> {
  private _revisers: {[name: string]: any};
  private _state: TState;

  /**
   * Initializes a new instance of the Store class.
   * @param initialState The initial state.
   */
  public constructor(initialState: TState) {
    super();
    this._revisers = {};
    this._state = initialState;
  }

  /**
   * Dispatches the action.
   * @param The action.
   */
  public dispatch<TRevision>(action: mio.IAction<TRevision>): void {
    if (this._revisers[action.name]) {
      let done = this.notify.bind(this, this._state);
      let thenable = this._revisers[action.name](this._state, action.revision);
      if (thenable && (thenable as PromiseLike<void>).then) {
        (thenable as PromiseLike<void>).then(done, done);
      } else {
        done();
      }
    }
  }

  /**
   * Gets the state.
   * @return The state.
   */
  public getState(): TState {
    return this._state;
  }

  /**
   * Registers the reviser.
   * @param name The name.
   * @param reviser The reviser.
   * @return The revision dispatcher.
   */
  public reviser<TRevision>(name: string, reviser: any): any {
    if (!this._revisers[name]) {
      this._revisers[name] = reviser;
      return (revision: TRevision) => this.dispatch({name: name, revision: revision});
    } else {
      throw new Error(`Failed to register reviser '${name}'.`);
    }
  }
}
