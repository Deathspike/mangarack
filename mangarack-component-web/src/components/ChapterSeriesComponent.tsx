import * as mio from '../default';

/**
 * Represents a chapter series component.
 */
export class ChapterSeriesComponent extends mio.StatelessComponent<{series: mio.ILibrarySeries}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    let numberOfUnreadChapters = this.props.series.numberOfChapters - this.props.series.numberOfReadChapters;
    return (
      <div className="chapterBodySeries">
        <div className="title">
          {(() => {
            if (numberOfUnreadChapters > 0) {
              return <div className="numberOfUnreadChapters">{numberOfUnreadChapters}</div>;
            } else {
              return null;
            }
          })()}
          <div className="text">{this.props.series.metadata.title}</div>
        </div>
        <div className="chapterBodySeriesOverview">
          <div className="chapterBodySeriesOverviewPreview">
            <div className="push" />
            <mio.SeriesImageComponent id={this.props.series.id} />
            <div className="provider">{this.props.series.providerName}</div>
          </div>
          <div className="chapterBodySeriesOverviewSummary">
            {(() => {
              if (this.props.series.metadata.summary) {
                return <div className="text">{this.props.series.metadata.summary}</div>;
              } else {
                return <div className="unknownText">No summary is available.</div>;
              }
            })()}
          </div>
        </div>
        <div className="chapterBodySeriesInfo">
          <div className="chapterBodySeriesInfoArtists">
            <div className="header">Artist(s):</div>
            <div className="text">{this.props.series.metadata.artists.reduce((p, c) => p + (p ? ', ' : '') + c, '')}</div>
          </div>
          <div className="chapterBodySeriesInfoArtists">
            <div className="header">Author(s):</div>
            <div className="text">{this.props.series.metadata.authors.reduce((p, c) => p + (p ? ', ' : '') + c, '')}</div>
          </div>
          <div className="chapterBodySeriesInfoGenres">
            <div className="header">Genre(s):</div>
            <div className="text">{this.props.series.metadata.genres.reduce((p, c) => p + (p ? ', ' : '') + mio.splitCamelCase(mio.GenreType[c]), '')}</div>
          </div>
          <div className="chapterBodySeriesInfoType">
            <div className="header">Type:</div>
            <div className="text">{mio.SeriesType[this.props.series.metadata.type]}</div>
          </div>
        </div>
      </div>
    );
  }
}
