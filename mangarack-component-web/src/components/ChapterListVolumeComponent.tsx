import * as mio from '../default';

/**
 * Represents a chapter list component.
 */
export class ChapterListVolumeComponent extends mio.StatelessComponent<{chapters: mio.ILibraryChapter[], volume?: number}> {
  /**
   * Renders the component.
   */
  public render(): JSX.Element {
    return (
      <div className="chapterBodyListVolume">
        <div className="header">
          {this.props.volume.hasValue ? `Volume ${this.props.volume.value}` : 'Unknown Volume'}
        </div>
        {this.props.chapters.map(chapter => <mio.ChapterListVolumeItemComponent chapter={chapter} />)}
      </div>
    );
  }
}
