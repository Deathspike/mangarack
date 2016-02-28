import * as mio from '../default';

/**
 * Represents a series component.
 */
export class SeriesComponent extends mio.StatelessComponent<{series: mio.IOption<mio.ILibrarySeries[]>}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="series">
        {(() => {
          if (!this.props.series.hasValue) {
            return <div className="pending"><i className="fa fa-spin fa-circle-o-notch"></i></div>;
          } else if (!this.props.series.value.length) {
            return <div className="none">Your library is empty.</div>;
          } else {
            return <div>{this.props.series.value.map(series => <mio.SeriesItemComponent series={series} />)}</div>;
          }
        })()}
      </div>
    );
  }
}
