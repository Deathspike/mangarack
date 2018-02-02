import * as mio from '../';
import * as mobx from 'mobx';
import shared = mio.shared;

export class IndexViewModel {
  @mobx.action
  async refreshAsync() {
    let request = await fetch('/api/library');
    let apiIndex = await request.json() as shared.IApiIndex;
    let apiIndexEntries = apiIndex.map(apiIndexEntry => new mio.IndexEntryViewModel(apiIndexEntry));
    this.entries = apiIndexEntries.sort((a, b) => a.uniqueKey < b.uniqueKey ? -1 : 1);
  }

  @mobx.observable
  entries: mio.IndexEntryViewModel[];
}
