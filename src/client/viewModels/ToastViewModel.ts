import * as mobx from 'mobx';
let toastId = 0;

export const toastViewModel = {
  show: mobx.action((text: string, timeout: number = 5000) => {
    let id = toastId++;
    toastViewModel.items.push({id, text});
    setTimeout(() => {
      for (let i = 0; i < toastViewModel.items.length; i++) {
        if (toastViewModel.items[i].id === id) {
          toastViewModel.items.splice(i, 1);
          return;
        }
      }
    }, timeout);
  }),

  items: mobx.observable([] as {id: number, text: string}[]),
}
