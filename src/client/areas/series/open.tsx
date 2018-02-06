import * as React from 'react';
import * as mio from './';
import shared = mio.shared;

export async function openAsync(listEntry: shared.IApiListEntry) {
  await mio.layerViewModel.openAsync(async () => {
    let vm = new mio.SeriesViewModel(listEntry);
    await vm.refreshAsync();
    return <mio.SeriesController vm={vm} />;
  });
}
