import * as React from 'react';
import * as mio from './';

export async function openAsync(providerName: string, seriesName: string, chapterName: string) {
  await mio.layerViewModel.openAsync(async () => {
    let vm = new mio.ChapterViewModel(providerName, seriesName, chapterName);
    await vm.refreshAsync();
    return <mio.ChapterController vm={vm} />;
  });
}
