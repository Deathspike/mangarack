import * as mio from '../';
import * as mobx from 'mobx';
import shared = mio.shared;

export class IndexViewModel {
  @mobx.action
  async fetchAsync() {
    let request = await fetch('/api/library');
    let apiIndex = await request.json() as shared.IApiIndex;
    let libaryIndexEntries = apiIndex.map(apiIndexEntry => new mio.IndexEntryViewModel(apiIndexEntry));
    this.entries = libaryIndexEntries.sort((a, b) => a.uniqueKey < b.uniqueKey ? -1 : 1);
  }

  @mobx.observable
  entries: mio.IndexEntryViewModel[] | undefined;
}
