import * as mobx from 'mobx';

export class LoadingViewModel {
  @mobx.action
  async loadAsync<T>(awaiter: () => Promise<T>) {
    try {
      this.isLoading = true;
      return await awaiter();
    } finally {
      mobx.runInAction(() => this.isLoading = false);
    }
  }

  @mobx.observable
  isLoading = false
}
