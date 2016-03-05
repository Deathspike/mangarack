import * as mio from '../default';

/**
 * Represents a chapter list component.
 */
export class ChapterListComponent extends mio.StatelessComponent<{chapters: mio.ILibraryChapter[]}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
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
