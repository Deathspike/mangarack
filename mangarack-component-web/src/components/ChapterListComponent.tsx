import * as mio from '../default';

/**
 * Represents a chapter list component.
 */
export class ChapterListComponent extends mio.StatelessComponent<{chapters: mio.ILibraryChapter[]}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    // Series:
    //  Back
    //  Add
    //  Download
    //  Refresh
    // Chapters (Mobile-only):
    //  Back
    //  Delete/Empty (On Desktop, shown at series information, via Modal).
    //  Download (On Desktop, shown at series information, via Modal -- consider merging with menu).
    //  Refresh
    // Pages:
    //  Back
    //  Delete (On Desktop, in floating status bar)
    //  PageOrientation (On Desktop, in floating status bar)
    //  CurrentPage/NumberOfPages (On Desktop, in floating status bar)

    // Delete chapter.
    // Download chapter (on read tap?)
    // Make download button apply on to this series.
    return (
      <div className="chapterList">
        {(() => {
          if (!this.props.chapters.length) {
            return <div className="none">No chapters available.</div>;
          } else {
            return (
              <span>
                <div className="chapterListHeader">
                  <div className="volume">Volume</div>
                  <div className="number">Number</div>
                  <div className="title">Title</div>
                </div>
                {this.props.chapters.map(chapter => <mio.ChapterListItemComponent chapter={chapter} />)}
              </span>
            );
          }
        })()}
      </div>
    );
  }
}
