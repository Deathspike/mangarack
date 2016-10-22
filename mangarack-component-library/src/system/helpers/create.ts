import * as mio from '../module';

/**
 * Creates the chapter context.
 * @param seriesContext The series context.
 * @param chapter The chapter.
 * @return The chapter context.
 */
export function createChapterContext(seriesContext: mio.IContextSeries, chapter: mio.IChapter): mio.IContextChapter {
  return {
    addedAt: Date.now(),
    id: ++seriesContext.lastChapterId,
    metadata: mio.copyChapterMetadata(chapter),
    numberOfReadPages: 0
  };
}

/**
 * Creates the series context.
 * @param context The context.
 * @param series The series.
 * @return The series context.
 */
export function createSeriesContext(context: mio.IContext, series: mio.ISeries): mio.IContextSeries {
  let seriesContext = {addedAt: Date.now(), chapters: {}, checkedAt: Date.now(), id: ++context.lastSeriesId, lastChapterId: 0, metadata: mio.copySeriesMetadata(series)};
  seriesContext.chapters = mio.mapChapterKey(series.chapters, chapter => mio.createChapterContext(seriesContext, chapter));
  return seriesContext;
}

/**
 * Creates the handler for the asynchronous function.
 * @param runAsync The asynchronous function.
 * @return The handler for the asynchronous function.
 */
export function createHandler<T extends Function>(runAsync: T): mio.ILibraryHandler<T> {
  return {runAsync: runAsync};
}
