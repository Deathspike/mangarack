import * as React from 'react';
import * as mio from './';

export async function createAsync(providerName: string, seriesName: string) {
  let vm = new mio.SeriesViewModel(providerName, seriesName);
  await vm.refreshAsync();
  mio.layerViewModel.open(<mio.SeriesController vm={vm} />);
}
