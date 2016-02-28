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
          {(() => {
            if (!this.props.series.hasValue) {
              return <div className="pending"><i className="fa fa-spin fa-circle-o-notch"></i></div>;
            } else if (!this.props.series.value.length) {
              return <div className="none">No series available.</div>;
            } else {
              return <div>{this.props.series.value.map(series => <mio.MenuSeriesListItemComponent series={series} />)}</div>;
            }
          })()}
        </div>
      );
    } else {
      return null;
    }
  }
}
