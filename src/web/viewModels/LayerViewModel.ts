import * as mobx from 'mobx';

export const layerViewModel = {
  close: mobx.action(() => {
    if (layerViewModel.layers.length <= 1) return;
    layerViewModel.layers.pop();
  }),

  open: mobx.action((component: JSX.Element) => {
    layerViewModel.layers.push(component);
  }),

  layers: mobx.observable([] as JSX.Element[])
}
