import * as mio from '../default';

/**
 * Represents a menu series list item component.
 */
export class MenuSeriesListItemComponent extends mio.StatelessComponent<{series: mio.ILibrarySeries}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    let numberOfUnreadChapters = this.props.series.numberOfChapters - this.props.series.numberOfReadChapters;
    return (
      <div className="menuSeriesListItem" key={this.props.series.id} onClick={() => mio.applicationActions.navigateSeries(this.props.series.id)}>
        {(() => {
          if (numberOfUnreadChapters > 0) {
            return <div className="numberOfUnreadChapters">{numberOfUnreadChapters}</div>;
          } else {
            return null;
          }
        })()}
        <div className="title">{this.props.series.metadata.title}</div>
        <div className="provider">{this.props.series.providerName}</div>
        <i className="fa fa-angle-right"></i>
      </div>
    );
  }
}
