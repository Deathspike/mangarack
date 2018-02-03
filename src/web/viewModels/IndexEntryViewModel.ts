import * as mio from '../';
import shared = mio.shared;

export class IndexEntryViewModel {
  private _apiIndexEntry: shared.IApiIndexEntry;

  constructor(apiIndexEntry: shared.IApiIndexEntry) {
    this._apiIndexEntry = apiIndexEntry;
  }

  get displayName() {
    return this._apiIndexEntry.seriesTitle;
  }

  get providerName() {
    return this._apiIndexEntry.providerName;
  }

  get uniqueKey() {
    return `${this._apiIndexEntry.providerName}/${this._apiIndexEntry.seriesName}`;
  }

  open() {
    location.href = `#${this.url}`;
  }

  get url() {
    return `/${encodeURIComponent(this._apiIndexEntry.providerName)}/${encodeURIComponent(this._apiIndexEntry.seriesName)}`;
  }
}
