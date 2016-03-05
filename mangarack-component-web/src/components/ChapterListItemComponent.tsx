import * as mio from '../default';

/**
 * Represents a chapter list item component.
 */
export class ChapterListItemComponent extends mio.StatelessComponent<{chapter: mio.ILibraryChapter}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    let metadata = this.props.chapter.metadata;
    // this.props.chapter.deletedAt
    // this.props.chapter.downloadedAt  -> show number of pages

    return (
      <div className="chapterListItem" key={this.props.chapter.id}>
        {(() => {
          if (this.props.chapter.numberOfPages.hasValue) {
            let progress = 100 / this.props.chapter.numberOfPages.value * this.props.chapter.numberOfReadPages;
            return <div className="available"><div className="availableProgress" style={{width: `${progress}%`}}></div></div>;
          } else {
            return <div className="unavailable"></div>;
          }
        })()}
        <div className="volume">{metadata.volume.hasValue ? metadata.volume.value : ''}</div>
        <div className="number">{metadata.number.hasValue ? metadata.number.value : ''}</div>
        <div className="title">{metadata.title}</div>
      </div>
    );
  }
}
