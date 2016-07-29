import * as mio from '../default';

/**
 * Represents a chapter component.
 */
export class ChapterComponent extends mio.StatelessComponent<{chapters?: mio.ILibraryChapter[], series?: mio.ILibrarySeries[], seriesId: number}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="chapter">
        <mio.ControlComponent />
        <div className="chapterBody">
          {(() => {
            if (!this.props.chapters || !this.props.series) {
              return <i className="fa fa-spin fa-circle-o-notch"></i>;
            } else {
              let series = this.props.series.find(series => series.id === this.props.seriesId);
              if (!series) {
                return <div className="unknown">Unknown series.</div>;
              } else {
                return (
                  <span>
                    <mio.ChapterSeriesComponent series={series} />
                    <mio.ChapterListComponent chapters={this.props.chapters} />
                  </span>
                );
              }
            }
          })()}
        </div>
      </div>
    );
  }
}
