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
          <div className="text">Series</div>
          <div className="minorText">Your Library</div>
          {(() => {
            if (this.props.series.hasValue) {
              return <div className="numberOfSeries">{this.props.series.value.length}</div>;
            } else {
              return null;
            }
          })()}
        </div>
        {(() => {
          if (this.props.series.hasValue) {
            return <mio.MenuSeriesListComponent series={this.props.series.value} />
          } else {
            return <i className="fa fa-spin fa-circle-o-notch"></i>;
          }
        })()}
      </div>
    );
  }
}
