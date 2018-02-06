import * as mio from '../';
import * as mobx from 'mobx';
import shared = mio.shared;

export class ListViewModel {
  @mobx.action
  async refreshAsync() {
    let request = await fetch('/api/library');
    let list = await request.json() as shared.IApiList;
    let listEntries = list.map(listEntry => new mio.ListEntryViewModel(listEntry));
    this.entries = listEntries.sort((a, b) => a.key < b.key ? -1 : 1);
  }

  @mobx.observable
  entries: mio.ListEntryViewModel[];
}
