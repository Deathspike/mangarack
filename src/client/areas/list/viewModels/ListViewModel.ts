import * as mio from '../';
import * as mobx from 'mobx';
import shared = mio.shared;

export class ListViewModel {
  @mobx.action
  async refreshAsync() {
    let request = await fetch('/api/library');
    let apiList = await request.json() as shared.IApiList;
    let apiListEntries = apiList.map(apiListEntry => new mio.ListEntryViewModel(apiListEntry));
    this.entries = apiListEntries.sort((a, b) => a.key < b.key ? -1 : 1);
  }

  @mobx.observable
  entries: mio.ListEntryViewModel[];
}
