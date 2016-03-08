import * as mio from '../default';

/**
 * Represents a chapter component.
 */
export class ChapterComponent extends mio.StatelessComponent<{chapters: mio.IOption<mio.ILibraryChapter[]>, series: mio.IOption<mio.ILibrarySeries[]>, seriesId: number}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="chapter">
        <mio.ControlComponent />
        <div className="chapterBody">
          {(() => {
            if (!this.props.chapters.hasValue || !this.props.series.hasValue) {
              return <i className="fa fa-spin fa-circle-o-notch"></i>;
            } else {
              let series = mio.option(this.props.series.value.find(series => series.id === this.props.seriesId));
              if (!series.hasValue) {
                return <div className="unknown">Unknown series.</div>;
              } else {
                return (
                  <span>
                    <mio.ChapterListComponent chapters={this.props.chapters.value} />
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
