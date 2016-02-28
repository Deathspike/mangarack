import * as mio from '../default';
export type SeriesItemComponentProperties = {series: mio.ILibrarySeries};
export type SeriesItemComponentState = {imageUrl: mio.IOption<string>};

/**
 * Represents a series item component.
 */
export class SeriesItemComponent extends mio.StatelessComponent<{series: mio.ILibrarySeries}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    let numberOfUnreadChapters = this.props.series.numberOfChapters - this.props.series.numberOfReadChapters;
    return (
      <div className="seriesItem" key={this.props.series.id}>
        <div className="push"></div>
        <div className="seriesItemBody">
          {numberOfUnreadChapters > 0 ?
            <span className="numberOfUnreadChapters">{numberOfUnreadChapters}</span> :
            null}
          <span className="title">{this.props.series.metadata.title}</span>
          <mio.SeriesItemPreviewComponent id={this.props.series.id} />
          <span className="provider">{this.props.series.providerName}</span>
        </div>
      </div>
    );
  }
}
