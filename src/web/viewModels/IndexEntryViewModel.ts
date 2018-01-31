import * as mio from '../';
import shared = mio.shared;

export class IndexEntryViewModel {
  private _libraryIndexEntry: shared.ILibraryIndexEntry;

  constructor(libraryIndexEntry: shared.ILibraryIndexEntry) {
    this._libraryIndexEntry = libraryIndexEntry;
  }

  get displayName() {
    return this._libraryIndexEntry.displayName;
  }

  get providerName() {
    return this._libraryIndexEntry.providerName;
  }

  get uniqueKey() {
    return `${this._libraryIndexEntry.providerName}/${this._libraryIndexEntry.seriesName}`;
  }

  get url() {
    return `/${encodeURIComponent(this._libraryIndexEntry.providerName)}/${encodeURIComponent(this._libraryIndexEntry.seriesName)}`;
  }
}
