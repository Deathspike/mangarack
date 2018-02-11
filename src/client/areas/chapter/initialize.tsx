import * as React from 'react';
import * as mio from './';
import shared = mio.shared;

export async function initializeAsync(listEntry: shared.IApiListEntry, series: shared.IApiSeries, seriesChapter: shared.IApiSeriesChapter) {
  let chapterControlVm = new mio.ChapterControlViewModel(listEntry, series, seriesChapter);
  let chapterVm = new mio.ChapterViewModel(listEntry, series, seriesChapter);
  await chapterVm.refreshAsync();
  return <mio.ChapterController chapterControlVm={chapterControlVm} chapterVm={chapterVm} />;
}
