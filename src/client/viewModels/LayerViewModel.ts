import * as mio from '../';
import * as mobx from 'mobx';

export const layerViewModel = {
  close: mobx.action(() => {
    layerViewModel.items.pop();
  }),

  openAsync: mobx.action(async (awaiter: () => Promise<JSX.Element>) => {
    mio.loadingViewModel.loadAsync(async () => {
      let item = await awaiter();
      mobx.runInAction(() => layerViewModel.items.push(item));
    });
  }),

  items: mobx.observable([] as JSX.Element[]),
}
