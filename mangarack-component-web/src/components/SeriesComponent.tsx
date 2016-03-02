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
        <div className="seriesControl">
          <span className="seriesControlStatus">
            <span className="title">Your Library</span>
            {(() => {
              if (this.props.series.hasValue) {
                return <span className="numberOfSeries">{this.props.series.value.length}</span>;
              } else {
                return null;
              }
            })()}
          </span>
          <span className="seriesControlButtons">
            <i className="fa fa-plus" onClick={() => mio.modalActions.setType(mio.ModalType.Series)}></i>
            <i className="fa fa-download" onClick={() => mio.modalActions.setType(mio.ModalType.Download)}></i>
            <i className="fa fa-refresh" onClick={() => mio.applicationActions.refreshSeries()}></i>
          </span>
        </div>
        <mio.SeriesListComponent series={this.props.series} />
      </div>
    );
  }
}
