import * as mio from '../module';

/**
 * Attempts to find the chapter in the context.
 * @internal
 * @param context The context.
 * @param seriesId The series identifier.
 * @param chapterId The chapter identifier.
 * @return The result of the attempt to find the chapter in the context.
 */
export function findContextChapter(context: mio.IContext, seriesId: number, chapterId: number): mio.IOption<mio.IFindContextChapterResult> {
  let seriesResult = findContextSeries(context, seriesId);
  if (seriesResult) {
    let series = seriesResult.series;
    for (let chapterMetadataDerivedKey in series.chapters) {
      if (series.chapters.hasOwnProperty(chapterMetadataDerivedKey)) {
        let chapter = series.chapters[chapterMetadataDerivedKey];
        if (chapter.id === chapterId) {
          return {
            chapter: chapter,
            chapterMetadataDerivedKey: chapterMetadataDerivedKey,
            provider: seriesResult.provider,
            providerName: seriesResult.providerName,
            series: seriesResult.series,
            seriesAddress: seriesResult.seriesAddress
          };
        }
      }
    }
  }
  return undefined;
}

/**
 * Attempts to find the series in the context.
 * @internal
 * @param context The context.
 * @param seriesId The series identifier.
 * @return The result of the attempt to find the series in the context.
 */
export function findContextSeries(context: mio.IContext, seriesId: number): mio.IOption<mio.IFindContextSeriesResult> {
  for (let providerName in context.providers) {
    if (context.providers.hasOwnProperty(providerName)) {
      let provider = context.providers[providerName];
      for (let seriesAddress in provider.series) {
        if (provider.series.hasOwnProperty(seriesAddress)) {
          let series = provider.series[seriesAddress];
          if (series.id === seriesId) {
            return {
              provider: provider,
              providerName: providerName,
              series: series,
              seriesAddress: seriesAddress
            };
          }
        }
      }
    }
  }
  return undefined;
}
