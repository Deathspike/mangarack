import * as mio from '../default';

/**
 * Represents a menu component.
 */
export class MenuComponent extends mio.StatelessComponent<{application: mio.IApplicationState}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="menu">
        {/* TODO: Search/Add. */}
        <mio.FilterComponent filter={this.props.application.filter} />
        {/* TODO: Ordering. */}
        <mio.MenuSeriesListComponent series={this.props.application.series} />
      </div>
    );
  }
}
