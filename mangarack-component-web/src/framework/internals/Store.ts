import * as fw from '../default';
import * as fwInternal from '../internals';

/**
 * Represents a store.
 * @internal
 */
export class Store<TState> extends fwInternal.Observable<TState> implements fw.IStore<TState> {
  private _activeRevisions: number;
  private _errorHandlers: ((error: any) => void)[];
  private _revisers: {[name: string]: any};
  private _state: TState;

  /**
   * Initializes a new instance of the Store class.
   * @param initialState The initial state.
   */
  public constructor(initialState: TState) {
    super();
    this._activeRevisions = 0;
    this._errorHandlers = [];
    this._revisers = {};
    this._state = initialState;
  }

  /**
   * Dispatches the action.
   * @param The action.
   */
  public dispatch<TRevision>(action: fw.IAction<TRevision>): PromiseLike<void>|void {
    // Keep track of each revision.
    if (this._activeRevisions === 0 && console.log) {
      console.log(action);
    }

    // Check if the revisor is available and initialize.
    if (this._revisers[action.name]) {
      let thenable: any;
      let done = () => {
        this._activeRevisions--;
        this.notify(this._state);
      };

      // Increment the active number of revisions and run the revisor.
      try {
        this._activeRevisions++;
        thenable = this._revisers[action.name](this._state, action.revision);
      } catch(error) {
        this.dispatchError(error);
        return;
      }

      // Attach to the promise completion or run the completion handler.
      if (thenable && (thenable as PromiseLike<void>).then) {
        return (thenable as PromiseLike<void>).then<void>(done, error => {
          this.dispatchError(error);
          done();
        });
      } else {
        done();
      }
    }
  }

  /**
   * Dispatches the error.
   * @param error The error.
   */
  public dispatchError(error: any): void {
    for (let errorHandler of this._errorHandlers) {
      if (!fw.isNull(errorHandler)) {
        errorHandler(error);
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

  /**
   * Registers the error handler.
   * @param errorHandler The error handler.
   */
  public reviserError(errorHandler: (error: any) => void): void {
    this._errorHandlers.push(errorHandler);
  }
}
