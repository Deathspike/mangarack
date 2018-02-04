import * as mobx from 'mobx';

export class LoadingViewModel {
  @mobx.action
  async loadAsync(awaiter: () => Promise<void>) {
    try {
      this.isLoading = true;
      await awaiter();
    } finally {
      mobx.runInAction(() => this.isLoading = false);
    }
  }

  @mobx.observable
  isLoading = false
}
