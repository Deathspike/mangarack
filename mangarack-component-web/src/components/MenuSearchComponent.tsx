import * as mio from '../default';

/**
 * Represents a menu search component.
 */
export class MenuSearchComponent extends mio.StatelessComponent<{search: string}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="menuSearch">
        <div className="header">Search</div>
        <input type="text" value={this.props.search} onChange={(e: mio.InputFormEvent) => mio.menuActions.setSearch(e.target.value)} onKeyDown={e => this._onKeyDown(e.keyCode, e.currentTarget)} />
      </div>
    );
  }

  /**
   * Occurs when a key is pressed down.
   * @param keyCode The key code.
   * @param target The target.
   */
  private _onKeyDown(keyCode: number, target: EventTarget): void {
    if (keyCode === 13) {
      let element = (target as any);
      if (element.blur && typeof element.blur === 'function') {
        element.blur();
      }
    }
  }
}
