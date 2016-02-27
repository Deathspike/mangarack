import * as mio from '../default';

/**
 * Represents a series list component.
 */
export class SeriesListComponent extends mio.StatelessComponent<{series: mio.ILibrarySeries[]}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="seriesList">
        {this.props.series.map(series => <mio.SeriesComponent series={series} />)}
      </div>
    );
  }
}
