import * as mio from '../default';

/**
 * Represents a menu component.
 */
export class MenuComponent extends mio.StatelessComponent<{filter: mio.IFilterState}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="menu">
        {/* TODO: Search/Add. */}
        <mio.FilterComponent filter={this.props.filter} />
        {/* TODO: Ordering. */}
      </div>
    );
  }
}
