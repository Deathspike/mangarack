import * as mobx from 'mobx';

export const loadingViewModel = {
  loadAsync: mobx.action(async (awaiter: () => Promise<void>) => {
    try {
      loadingViewModel.isLoading.set(true);
      await awaiter();
    } finally {
      mobx.runInAction(() => loadingViewModel.isLoading.set(false));
    }
  }),

  isLoading: mobx.observable(false)
};
