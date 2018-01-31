import * as mio from '../';
import * as mobx from 'mobx';
import shared = mio.shared;

export class IndexViewModel {
  @mobx.action
  async fetchAsync() {
    let request = await fetch('/api/library');
    let libraryIndex = await request.json() as shared.ILibraryIndex;
    let libaryIndexEntries = libraryIndex.map(libraryIndexEntry => new mio.IndexEntryViewModel(libraryIndexEntry));
    this.entries = libaryIndexEntries.sort((a, b) => a.uniqueKey < b.uniqueKey ? -1 : 1);
  }

  @mobx.observable
  entries: mio.IndexEntryViewModel[] | undefined;
}
