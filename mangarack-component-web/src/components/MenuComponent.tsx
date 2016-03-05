import * as mio from '../default';

/**
 * Represents a menu component.
 */
export class MenuComponent extends mio.StatelessComponent<{controller: string, menu: mio.IMenuState, series: mio.IOption<mio.ILibrarySeries[]>}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <mio.LazyComponent className={`menu menu-controller-${this.props.controller}`}>
        <mio.ControlComponent />
        <mio.MenuSelectComponent menu={this.props.menu} />
        {(() => {
          if (this.props.menu.type === mio.MenuType.Default) {
            return <mio.MenuSeriesComponent series={this.props.series} />;
          } else {
            return null;
          }
        })()}
      </mio.LazyComponent>
    );
  }
}
