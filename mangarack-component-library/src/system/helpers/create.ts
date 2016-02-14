import * as mio from '../module';

/**
 * Creates the context chapter based on the chapter.
 * @param chapter The chapter.
 * @return The context chapter.
 */
export function createContextChapter(chapter: mio.IChapter): mio.IContextChapter {
  return {
    addedAt: Date.now(),
    deletedAt: mio.option<number>(),
    downloadedAt: mio.option<number>(),
    id: ++this._context.lastId,
    lastReadAt: mio.option<number>(),
    metadata: mio.copyChapterMetadata(chapter),
    numberOfPages: mio.option<number>(),
    numberOfReadPages: 0
  };
}

/**
 * Creates the context series based on the series.
 * @param series The series.
 * @return The context series.
 */
export function createContextSeries(series: mio.ISeries): mio.IContextSeries {
  return {
    addedAt: Date.now(),
    chapters: mio.mapChaptersByKey(series.chapters, mio.createContextChapter),
    checkedAt: Date.now(),
    id: ++this._context.lastId,
    metadata: mio.copySeriesMetadata(series)
  };
}

/**
 * Creates the handler for the asynchronous function.
 * @param runAsync The asynchronous function.
 * @return The handler for the asynchronous function.
 */
export function createHandler<T extends Function>(runAsync: T): mio.ILibraryHandler<T> {
  return {runAsync: runAsync};
}
