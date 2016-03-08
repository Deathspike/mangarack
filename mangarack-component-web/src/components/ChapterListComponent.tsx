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
      <div className="chapterBodyList">
        {(() => {
          if (!this.props.chapters.length) {
            return <div className="none">No chapters available.</div>;
          } else {
            let result = assignVolumes(this.props.chapters);
            return (
              <span>
                {(() => {
                  if (result.unknownVolume.length) {
                    return <mio.ChapterListVolumeComponent chapters={result.unknownVolume} volume={mio.option<number>()} />;
                  } else {
                    return null;
                  }
                })()}
                {Object.keys(result.volumes)
                  .map(key => parseInt(key, 10))
                  .sort((a, b) => a > b ? 1 : -1)
                  .map(key => <mio.ChapterListVolumeComponent chapters={result.volumes[key]} volume={mio.option(key)} />)}
              </span>
            );
          }
        })()}
      </div>
    );
  }
}

/**
 * Assigns the chapters to volumes.
 * @param chapters The chapters.
 * @return The chapters assigned to volumes.
 */
function assignVolumes(chapters: mio.ILibraryChapter[]): {unknownVolume: mio.ILibraryChapter[], volumes: {[key: number]: mio.ILibraryChapter[]}} {
  let unknownVolume: mio.ILibraryChapter[] = [];
  let volumes: {[key: number]: mio.ILibraryChapter[]} = {};
  for (let chapter of chapters) {
    if (chapter.metadata.volume.hasValue) {
      if (!volumes[chapter.metadata.volume.value]) {
        volumes[chapter.metadata.volume.value] = [chapter];
      } else {
        volumes[chapter.metadata.volume.value].push(chapter);
      }
    } else {
      unknownVolume.push(chapter);
    }
  }
  return {unknownVolume: unknownVolume, volumes: volumes};
}
