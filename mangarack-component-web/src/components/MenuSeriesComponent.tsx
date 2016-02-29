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
          <span className="subtext">Your Library</span>
        </div>
        {(() => {
          if (this.props.series.hasValue) {
            return (
              <div>
                <div className="menuSeriesControl">
                  <i className="fa fa-plus" onClick={() => mio.applicationActions.setModalType(mio.ModalType.Series)}></i>
                  <i className="fa fa-download"></i>
                  <i className="fa fa-refresh" onClick={() => mio.applicationActions.refreshSeries()}></i>
                </div>
                <mio.MenuSeriesListComponent series={this.props.series.value} />
              </div>
            );
          } else {
            return <div className="pending"><i className="fa fa-spin fa-circle-o-notch"></i></div>;
          }
        })()}
      </div>
    );
  }
}
