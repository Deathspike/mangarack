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
      <div className="menuSeriesListItem" key={this.props.series.id}>
        {(() => {
          if (numberOfUnreadChapters > 0) {
            return <span className="numberOfUnreadChapters">{numberOfUnreadChapters}</span>;
          } else {
            return null;
          }
        })()}
        <span className="title">{this.props.series.metadata.title}</span>
        <span className="provider">{this.props.series.providerName}</span>
        <i className="fa fa-angle-right"></i>
      </div>
    );
  }
}
