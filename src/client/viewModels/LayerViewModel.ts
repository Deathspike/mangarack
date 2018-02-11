import * as mio from '../';
import * as mobx from 'mobx';

// TODO: Forward state should also work in every situation (e.g. reload, reset), or not break things.
// [Improvement] window.addEventListener should clean up on an application unload (to be written).
export class LayerViewModel {
  constructor() {
    window.addEventListener('popstate', e => this._processHistory(e.state));
  }

  @mobx.action
  close() {
    history.back();
  }

  @mobx.action
  async openAsync(awaiter: Promise<JSX.Element>) {
    await mio.loadingViewModel.loadAsync(async () => {
      let item = await awaiter;
      mobx.runInAction(() => {
        if (this.items.length) history.pushState(this.items.length, '');
        this.items.push(item);
        this.historyItems = [];
      });
    });
  }

  @mobx.action
  async replaceAsync(awaiter: Promise<JSX.Element>) {
    await mio.loadingViewModel.loadAsync(async () => {
      let item = await awaiter;
      mobx.runInAction(() => this.items.splice(this.items.length - 1, 1, item));
    });
  }

  @mobx.action
  reset() {
    for (let i = this.items.length; i > 1; i--) {
      this.close();
    }
  }

  @mobx.observable
  items = [] as JSX.Element[];

  @mobx.observable
  historyItems = [] as JSX.Element[];

  @mobx.action
  private _processHistory(length: number) {
    if (length >= this.items.length) {
      while (this.items.length <= length && this.historyItems.length) {
        let lastHistoryItem = this.historyItems[this.historyItems.length - 1];
        this.items.push(lastHistoryItem);
        this.historyItems.pop();
      }
    } else {
      let lastItem = this.items[this.items.length - 1];
      this.historyItems.push(lastItem);
      this.items.pop();
    }
  }
}
