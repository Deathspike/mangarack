import * as React from 'react';
import * as mio from './';

export async function createAsync(providerName: string, seriesName: string) {
  mio.layerViewModel.openAsync(async () => {
    let vm = new mio.SeriesViewModel(providerName, seriesName);
    await vm.refreshAsync();
    return <mio.SeriesController vm={vm} />;
  });
}
