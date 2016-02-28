import * as mio from '../default';

/**
 * Represents a menu series component.
 */
export class MenuSeriesComponent extends mio.StatelessComponent<{series: mio.IOption<mio.ILibrarySeries[]>}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    if (this.props.series.hasValue) {
      return (
        <div className="menuSeries">
          <div className="header">
            <span className="text">Series</span>
            <span className="subtext">Local Library</span>
          </div>
          <div className="menuSeriesControl">
            <i className="fa fa-plus"></i>
            <i className="fa fa-download"></i>
            <i className="fa fa-refresh"></i>
          </div>
          <mio.MenuSeriesListComponent series={this.props.series} />
        </div>
      );
    } else {
      return null;
    }
  }
}
