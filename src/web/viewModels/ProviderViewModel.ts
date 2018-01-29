import * as mio from '../';
import * as mobx from 'mobx';
import shared = mio.shared;

export class ProviderViewModel {
  @mobx.action
  async fetchAsync() {
    let request = await fetch('/api/library');
    let response = await request.json();
    this.rawData = response;
  }

  @mobx.computed
  get currentData() {
    if (this.rawData) {
      return this.rawData
        .map(({displayName, seriesName, providerName}) => ({displayName, seriesName, providerName}))
        .sort((a, b) => a.displayName < b.displayName ? -1 : 1);
    } else {
      return undefined;
    }
  }

  @mobx.observable
  rawData: shared.ILibraryProvider | undefined;
}
