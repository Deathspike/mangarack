import * as mio from '../default';

/**
 * Represents a series component.
 */
export class SeriesComponent extends mio.StatelessComponent<{series: mio.IOption<mio.ILibrarySeries[]>}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    /* TODO: Make these series buttons do something (idem on the menu buttons for phone). */
    return (
      <div className="series">
        <div className="seriesControl">
          <span className="title">Your Library</span>
          <span className="seriesControlButtons">
            <i className="fa fa-plus" onClick={() => mio.applicationActions.setModalType(mio.ModalType.Series)}></i>
            <i className="fa fa-download"></i>
            <i className="fa fa-refresh"></i>
          </span>
        </div>
        <mio.SeriesListComponent series={this.props.series} />
      </div>
    );
  }
}
