import * as React from 'react';
import * as mio from './';

export async function createAsync() {
  let vm = new mio.ListViewModel();
  await vm.refreshAsync();
  mio.layerViewModel.open(<mio.ListController vm={vm} />);
}
