import * as mio from '../default';

/**
 * Represents a menu series list component.
 */
export class MenuSeriesListComponent extends mio.StatelessComponent<{series: mio.ILibrarySeries[]}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="menuSeriesList">
        {(() => {
          if (!this.props.series.length) {
            return <span className="none">No series available.</span>;
          } else {
            return <span>{this.props.series.map(series => <mio.MenuSeriesListItemComponent series={series} />)}</span>;
          }
        })()}
      </div>
    );
  }
}
