import * as mio from '../default';

/**
 * Represents a series list component.
 */
export class SeriesListComponent extends mio.StatelessComponent<{series: mio.IOption<mio.ILibrarySeries[]>}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    /* TODO: Empty text. */
    return (
      <div className="seriesList">
        {this.props.series.hasValue ?
          this.props.series.value.map(series => <mio.SeriesComponent series={series} />) :
          <div className="pendingValue"><i className="fa fa-spin fa-circle-o-notch"></i></div>}
      </div>
    );
  }
}
