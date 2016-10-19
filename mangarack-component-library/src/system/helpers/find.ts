import * as mio from '../module';

/**
 * Attempts to find the chapter in the context.
 * @param context The context.
 * @param seriesId The series identifier.
 * @param chapterId The chapter identifier.
 * @return The result of the attempt to find the chapter in the context.
 */
export function findChapterContext(context: mio.IContext, seriesId: number, chapterId: number): mio.IOption<mio.IMatchChapter> {
  let seriesMatch = findSeriesContext(context, seriesId);
  if (seriesMatch) {
    let series = seriesMatch.series;
    for (let chapterMetadataDerivedKey in series.chapters) {
      if (series.chapters.hasOwnProperty(chapterMetadataDerivedKey)) {
        let chapter = series.chapters[chapterMetadataDerivedKey];
        if (chapter.id === chapterId) {
          return {
            chapter: chapter,
            chapterMetadataDerivedKey: chapterMetadataDerivedKey,
            provider: seriesMatch.provider,
            providerName: seriesMatch.providerName,
            series: seriesMatch.series,
            seriesAddress: seriesMatch.seriesAddress
          };
        }
      }
    }
  }
  return undefined;
}

/**
 * Attempts to find the series in the context.
 * @param context The context.
 * @param seriesId The series identifier.
 * @return The result of the attempt to find the series in the context.
 */
export function findSeriesContext(context: mio.IContext, seriesId: number): mio.IOption<mio.IMatchSeries> {
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
