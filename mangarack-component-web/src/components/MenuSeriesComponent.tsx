import * as mio from '../default';

/**
 * Represents a menu series component.
 */
export class MenuSeriesComponent extends mio.StatelessComponent<{series: mio.IOption<mio.ILibrarySeries[]>}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    /* TODO: Should not show this anywhere EXCEPT at the main screen, e.g not using filtering etc? */
    /* TODO: A loading indicator for phones is a must. */
    if (this.props.series.hasValue) {
      return (
        <div className="menuSeries">
          <div className="header">Series</div>
          {this.props.series.value.map(series => <mio.MenuSeriesItemComponent series={series} />)}
        </div>
      );
    } else {
      return null;
    }
  }
}
