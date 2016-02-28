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
        <mio.MenuFilterComponent menu={this.props.application.menu} />
        {/* TODO: Ordering. */}
        {this.props.application.menu.type === mio.MenuType.Default ?
          <mio.MenuSeriesComponent series={this.props.application.series} /> :
          null}
      </div>
    );
  }
}
