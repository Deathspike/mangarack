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
            return <div className="pending"><i className="fa fa-spin fa-circle-o-notch"></i></div>;
          } else if (!this.props.series.value.length) {
            return <div className="none">No series available.</div>;
          } else {
            return <div>{this.props.series.value.map(series => <mio.SeriesListItemComponent series={series} />)}</div>;
          }
        })()}
      </div>
    );
  }
}
