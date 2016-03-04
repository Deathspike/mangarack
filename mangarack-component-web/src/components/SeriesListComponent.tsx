import * as mio from '../default';

/**
 * Represents a series list component.
 */
export class SeriesListComponent extends mio.StatelessComponent<{series: mio.IOption<mio.ILibrarySeries[]>}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="seriesList">
        {(() => {
          if (!this.props.series.hasValue) {
            return <i className="fa fa-spin fa-circle-o-notch"></i>;
          } else if (!this.props.series.value.length) {
            return <div className="none">No series available.</div>;
          } else {
            return <span>{this.props.series.value.map(series => <mio.SeriesListItemComponent series={series} />)}</span>;
          }
        })()}
      </div>
    );
  }
}
