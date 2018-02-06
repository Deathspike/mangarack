import * as React from 'react';
import * as mio from './';
import shared = mio.shared;

export async function openAsync(listEntry: shared.IApiListEntry, seriesChapter: shared.IApiSeriesChapter) {
  await mio.layerViewModel.openAsync(async () => {
    let vm = new mio.ChapterViewModel(listEntry, seriesChapter);
    await vm.refreshAsync();
    return <mio.ChapterController vm={vm} />;
  });
}
