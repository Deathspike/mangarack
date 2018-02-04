import * as React from 'react';
import * as mio from './';

export async function createAsync(providerName: string, seriesName: string, chapterName: string) {
  let vm = new mio.ChapterViewModel(providerName, seriesName, chapterName);
  await vm.refreshAsync();
  mio.LayerViewModel.get().open(<mio.ChapterController vm={vm} />);
}
