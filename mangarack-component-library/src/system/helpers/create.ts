'use strict';
import * as mio from '../module';

/**
 * Creates the context chapter based on the chapter.
 * @param context The context.
 * @param chapter The chapter.
 * @return The context chapter.
 */
export function createContextChapter(context: mio.IContext, chapter: mio.IChapter): mio.IContextChapter {
  return {
    addedAt: Date.now(),
    deletedAt: mio.option<number>(),
    downloadedAt: mio.option<number>(),
    id: ++context.lastId,
    lastReadAt: mio.option<number>(),
    metadata: mio.copyChapterMetadata(chapter),
    numberOfPages: mio.option<number>(),
    numberOfReadPages: 0
  };
}

/**
 * Creates the context series based on the series.
 * @param context The context.
 * @param series The series.
 * @return The context series.
 */
export function createContextSeries(context: mio.IContext, series: mio.ISeries): mio.IContextSeries {
  let seriesId = ++context.lastId;
  return {
    addedAt: Date.now(),
    chapters: mio.mapByChapterKey(series.chapters, chapter => mio.createContextChapter(context, chapter)),
    checkedAt: Date.now(),
    id: seriesId,
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
