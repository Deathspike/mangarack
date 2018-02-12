import * as React from 'react';
import * as mio from './';
import shared = mio.shared;

export async function initializeAsync(listEntry: shared.IApiListEntry, series: shared.IApiSeries, seriesChapter: shared.IApiSeriesChapter, wentBack = false) {
  let controlVm = new mio.ChapterControlViewModel(listEntry, series, seriesChapter);
  let pageVm = new mio.ChapterPageViewModel(listEntry, series, seriesChapter, wentBack);
  await pageVm.refreshAsync();
  return <mio.ChapterController controlVm={controlVm} pageVm={pageVm} />;
}
