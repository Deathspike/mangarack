import * as mio from '../';
import * as mobx from 'mobx';

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
        this.items.push(item);
        this.historyItems = [];
        history.pushState(`${this.sessionId}/${this.items.length}`, '');
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

  @mobx.observable
  sessionId = uuidv4()

  @mobx.action
  private _processHistory(value: any) {
    let index = String(value).indexOf('/');
    let sessionId = index !== -1 ? String(value).substr(0, index) : undefined;
    if (sessionId === this.sessionId) {
      let length = parseInt(value.substr(index + 1));
      if (length > this.items.length) {
        while (this.items.length < length && this.historyItems.length) {
          let lastHistoryItem = this.historyItems[this.historyItems.length - 1];
          this.items.push(lastHistoryItem);
          this.historyItems.pop();
        }
      } else {
        let lastItem = this.items[this.items.length - 1];
        this.historyItems.push(lastItem);
        this.items.pop();
      }
    } else {
      history.back();
    }
  }
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
