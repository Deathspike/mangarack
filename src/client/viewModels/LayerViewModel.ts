import * as mobx from 'mobx';

export const layerViewModel = {
  close: mobx.action(() => {
    layerViewModel.layers.pop();
  }),

  openAsync: mobx.action(async (awaiter: () => Promise<JSX.Element>) => {
    try {
      layerViewModel.loading.set(true);
      layerViewModel.layers.push(await awaiter());
    } finally {
      layerViewModel.loading.set(false);
    }
  }),

  layers: mobx.observable([] as JSX.Element[]),
  loading: mobx.observable(false)
}
