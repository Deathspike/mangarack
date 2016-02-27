import * as mio from '../default';

/**
 * Represents a menu series list component.
 */
export class MenuSeriesListComponent extends mio.StatelessComponent<{series: mio.IOption<mio.ILibrarySeries[]>}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    if (this.props.series.hasValue) {
      return (
        <div className="menuSeriesList">
          <div className="menuSeriesHeader">Series</div>
          {this.props.series.value.map(series => <mio.MenuSeriesComponent series={series} />)}
        </div>
      );
    } else {
      return null;
    }
  }
}
