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
        <input type="text" value={this.props.search} onChange={(e: mio.InputFormEvent) => mio.menuActions.setSearch(e.target.value)} />
      </div>
    );
  }
}
