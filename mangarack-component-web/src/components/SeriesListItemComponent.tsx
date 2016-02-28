import * as mio from '../default';

/**
 * Represents a series list item component.
 */
export class SeriesListItemComponent extends mio.StatelessComponent<{series: mio.ILibrarySeries}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    let numberOfUnreadChapters = this.props.series.numberOfChapters - this.props.series.numberOfReadChapters;
    return (
      <div className="seriesListItem" key={this.props.series.id}>
        <div className="push"></div>
        <div className="seriesListItemBody">
          {(() => {
            if (numberOfUnreadChapters > 0) {
              return <span className="numberOfUnreadChapters">{numberOfUnreadChapters}</span>;
            } else {
              return null;
            }
          })()}
          <span className="title">{this.props.series.metadata.title}</span>
          <mio.SeriesListItemPreviewComponent id={this.props.series.id} />
          <span className="provider">{this.props.series.providerName}</span>
        </div>
      </div>
    );
  }
}
