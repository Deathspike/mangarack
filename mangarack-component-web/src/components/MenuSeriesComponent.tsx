import * as mio from '../default';

/**
 * Represents a menu series component.
 */
export class MenuSeriesComponent extends mio.StatelessComponent<{series: mio.IOption<mio.ILibrarySeries[]>}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="menuSeries">
        <div className="header">
          <span className="text">Series</span>
          <span className="minorText">Your Library</span>
          {(() => {
            if (this.props.series.hasValue) {
              return <span className="numberOfSeries">{this.props.series.value.length}</span>;
            } else {
              return null;
            }
          })()}
        </div>
        {(() => {
          if (this.props.series.hasValue) {
            return (
              <span>
                <div className="menuSeriesControl">
                  <i className="fa fa-plus" onClick={() => mio.modalActions.setType(mio.ModalType.Series)}></i>
                  <i className="fa fa-download" onClick={() => mio.modalActions.setType(mio.ModalType.Download)}></i>
                  <i className="fa fa-refresh" onClick={() => mio.applicationActions.refreshSeries()}></i>
                </div>
                <mio.MenuSeriesListComponent series={this.props.series.value} />
              </span>
            );
          } else {
            return <i className="fa fa-spin fa-circle-o-notch"></i>;
          }
        })()}
      </div>
    );
  }
}
