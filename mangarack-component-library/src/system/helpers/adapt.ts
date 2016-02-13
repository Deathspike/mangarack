import * as mio from '../module';

/**
 * Adapts the chapter to a context chapter.
 * @param chapter The chapter.
 * @return The context chapter.
 */
export function adaptChapterToContext(chapter: mio.IChapter): mio.IContextChapter {
  return {
    addedAt: Date.now(),
    deletedAt: mio.option<number>(),
    downloadedAt: mio.option<number>(),
    id: ++this._context.lastId,
    lastReadAt: mio.option<number>(),
    metadata: mio.copyChapterMetadata(chapter),
    numberOfPages: mio.option<number>(),
    numberOfReadPages: mio.option<number>()
  };
}
/**
 * Adapts the chapter to a key.
 * @param chapter The chapter.
 * @return The key.
 */
export function adaptChapterToKey(chapter: mio.IChapter): string {
  if (chapter.volume.value == null) {
    return `#${chapter.number.value}`;
  } else {
    return `V${chapter.volume.value} #${chapter.number.value}`;
  }
}
