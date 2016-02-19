import * as mio from '../module';

/**
 * Attempts to find the chapter in the context.
 * @param context The context.
 * @param seriesId The series identifier.
 * @param chapterId The chapter identifier.
 * @return The result of the attempt to find the chapter in the context.
 */
export function findContextChapter(context: mio.IContext, seriesId: number, chapterId: number): mio.IOption<mio.IFindContextChapterResult> {
  let seriesResult = findContextSeries(context, seriesId);
  if (seriesResult.hasValue) {
    let series = seriesResult.value.series;
    for (let chapterMetadataDerivedKey in series.chapters) {
      let chapter = series.chapters[chapterMetadataDerivedKey];
      if (chapter.id === chapterId) {
        return mio.option<mio.IFindContextChapterResult>({
          chapter: chapter,
          chapterMetadataDerivedKey: chapterMetadataDerivedKey,
          provider: seriesResult.value.provider,
          providerName: seriesResult.value.providerName,
          series: seriesResult.value.series,
          seriesAddress: seriesResult.value.seriesAddress
        });
      }
    }
  }
  return mio.option<mio.IFindContextChapterResult>();
}

/**
 * Attempts to find the series in the context.
 * @param context The context.
 * @param seriesId The series identifier.
 * @return The result of the attempt to find the series in the context.
 */
export function findContextSeries(context: mio.IContext, seriesId: number): mio.IOption<mio.IFindContextSeriesResult> {
  for (let providerName in context.providers) {
    let provider = context.providers[providerName];
    for (let seriesAddress in provider.series) {
      let series = provider.series[seriesAddress];
      if (series.id === seriesId) {
        return mio.option<mio.IFindContextSeriesResult>({
          provider: provider,
          providerName: providerName,
          series: series,
          seriesAddress: seriesAddress
        });
      }
    }
  }
  return mio.option<mio.IFindContextSeriesResult>();
}
