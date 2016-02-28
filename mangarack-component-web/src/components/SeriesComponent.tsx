import * as mio from '../default';

/**
 * Represents a series component.
 */
export class SeriesComponent extends mio.StatelessComponent<{series: mio.IOption<mio.ILibrarySeries[]>}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    /* TODO: Make these buttons available in menu, too, when on phone. */
    /* TODO: Make these series buttons do something. */
    return (
      <div className="series">
        <div className="seriesControl">
          <span className="title">Local Library</span>
          <span className="seriesControlButtons">
            <i className="fa fa-plus"></i>
            <i className="fa fa-download"></i>
            <i className="fa fa-refresh"></i>
          </span>
        </div>
        <mio.SeriesListComponent series={this.props.series} />
      </div>
    );
  }
}
