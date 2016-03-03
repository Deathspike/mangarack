import * as mio from '../default';

/**
 * Represents a menu component.
 */
export class MenuComponent extends mio.StatelessComponent<{menu: mio.IMenuState, series: mio.IOption<mio.ILibrarySeries[]>}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="menu">
        <mio.MenuSelectComponent menu={this.props.menu} />
        {(() => {
          if (this.props.menu.type === mio.MenuType.Default) {
            return <mio.MenuSeriesComponent series={this.props.series} />;
          } else {
            return null;
          }
        })()}
      </div>
    );
  }
}
