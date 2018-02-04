import * as mio from '../';
import * as mobx from 'mobx';
import shared = mio.shared;
let toastId = 0;

export const toastViewModel = {
  show: mobx.action((text: string) => {
    let id = toastId++;
    toastViewModel.items.push({id, text});
    setTimeout(() => cleanUp(id), shared.settings.clientToastTimeout);
  }),

  items: mobx.observable([] as {id: number, text: string}[]),
}

function cleanUp(id: number) {
  for (let i = 0; i < toastViewModel.items.length; i++) {
    if (toastViewModel.items[i].id === id) {
      mobx.runInAction(() => toastViewModel.items.splice(i, 1));
      return;
    }
  }
}
