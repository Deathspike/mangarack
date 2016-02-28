import * as mio from '../default';

/**
 * Represents a menu series component.
 */
export class MenuSeriesComponent extends mio.StatelessComponent<{series: mio.IOption<mio.ILibrarySeries[]>}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    /* TODO: A loading indicator for phones is a must. */
    if (this.props.series.hasValue) {
      return (
        <div className="menuSeries">
          <div className="header">Series</div>
          {(() => {
            if (!this.props.series.hasValue) {
              return <div className="pending"><i className="fa fa-spin fa-circle-o-notch"></i></div>;
            } else if (!this.props.series.value.length) {
              return <div className="none">Your library is empty.</div>;
            } else {
              return <div>{this.props.series.value.map(series => <mio.MenuSeriesItemComponent series={series} />)}</div>;
            }
          })()}
        </div>
      );
    } else {
      return null;
    }
  }
}
