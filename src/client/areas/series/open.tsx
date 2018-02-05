import * as React from 'react';
import * as mio from './';

export async function openAsync(providerName: string, seriesName: string) {
  await mio.layerViewModel.openAsync(async () => {
    let vm = new mio.SeriesViewModel(providerName, seriesName);
    await vm.refreshAsync();
    return <mio.SeriesController vm={vm} />;
  });
}
