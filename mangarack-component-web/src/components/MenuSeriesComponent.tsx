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
            return <mio.MenuSeriesListComponent series={this.props.series.value} />
          } else {
            return <i className="fa fa-spin fa-circle-o-notch"></i>;
          }
        })()}
      </div>
    );
  }
}
