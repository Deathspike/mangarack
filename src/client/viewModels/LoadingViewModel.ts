import * as mobx from 'mobx';

export const loadingViewModel = {
  isLoading: mobx.observable(false),
  loadAsync: mobx.action(async (awaiter: () => Promise<void>) => {
    try {
      loadingViewModel.isLoading.set(true);
      await awaiter();
    } finally {
      loadingViewModel.isLoading.set(false);
    }
  })
};
