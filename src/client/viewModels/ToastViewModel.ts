import * as mio from '../';
import * as mobx from 'mobx';
let toastId = 0;

export class ToastViewModel {
  @mobx.action
  show(text: string)  {
    let id = toastId++;
    this.items.push({id, text});
    setTimeout(() => this._removeToast(id), mio.settings.toastTimeout);
  }

  @mobx.action
  private _removeToast(id: number) {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id === id) {
        this.items.splice(i, 1);
        return;
      }
    }
  }
  
  @mobx.observable
  items = [] as {id: number, text: string}[];
}
