import * as React from 'react';
import * as mio from './';
import shared = mio.shared;

export async function initializeAsync(listEntry: shared.IApiListEntry, series: shared.IApiSeries, seriesChapter: shared.IApiSeriesChapter) {
  let vm = new mio.ChapterViewModel(listEntry, series, seriesChapter);
  await vm.refreshAsync();
  return <mio.ChapterController vm={vm} />;
}
