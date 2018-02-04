import * as mio from '../';
import * as mobx from 'mobx';

export class LayerViewModel {
  @mobx.action
  close() {
    this.items.pop();
  }

  @mobx.action
  async openAsync(awaiter: () => Promise<JSX.Element>) {
    mio.loadingViewModel.loadAsync(async () => {
      let item = await awaiter();
      mobx.runInAction(() => this.items.push(item));
    });
  }

  @mobx.observable
  items = [] as JSX.Element[];
}
