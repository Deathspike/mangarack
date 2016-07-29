import * as mio from '../default';

/**
 * Represents a chapter list component.
 */
export class ChapterListVolumeItemComponent extends mio.StatelessComponent<{chapter: mio.ILibraryChapter}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    /* TODO: Show when an entry was deleted on the server... */
    /* TODO: On tap, navigate, or download prompt. */
    return (
      <div className="chapterBodyListVolumeItem">
        {(() => {
          if (this.props.chapter.numberOfPages.hasValue) {
            let numberOfUnreadPages = this.props.chapter.numberOfPages.value - this.props.chapter.numberOfReadPages;
            if (numberOfUnreadPages > 0) {
              return <div className="numberOfUnreadPages">{numberOfUnreadPages}</div>;
            }
          }
          return null;
        })()}
        <div className={`title ${this.props.chapter.downloadedAt.hasValue ? 'available' : 'unavailable'}`}>
          {`#${format(3, this.props.chapter.metadata.number.value)}`}
          {(() => {
            if (this.props.chapter.metadata.title) {
              return <span>{this.props.chapter.metadata.title}</span>;
            } else {
              return <span className="unknownTitle">Unknown title</span>;
            }
          })()}
        </div>
        <i className="fa fa-angle-right"></i>
      </div>
    );
  }
}

/**
 * Formats the number (with possible fraction digits) to be prefixed with leading zeros.
 * @param minimumWholeNumberLength The minimum length of whole numbers.
 * @param number The number.
 * @return The number prefixed with leading zeros.
 */
function format(minimumWholeNumberLength: number, number: number): string {
  let value = number.toString();
  let index = value.indexOf('.');
  for (let i = minimumWholeNumberLength - (index >= 0 ? index : value.length); i > 0; i--) {
    value = '0' + value;
  }
  return value;
}
