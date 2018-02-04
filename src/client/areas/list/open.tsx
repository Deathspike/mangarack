import * as React from 'react';
import * as mio from './';

export async function openAsync() {
  mio.layerViewModel.openAsync(async () => {
    let vm = new mio.ListViewModel();
    await vm.refreshAsync();
    return <mio.ListController vm={vm} />;
  });
}
