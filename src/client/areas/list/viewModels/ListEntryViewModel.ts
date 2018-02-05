import * as mio from '../';
import {openAsync} from '../../series';
import shared = mio.shared;

export class ListEntryViewModel {
  private _apiListEntry: shared.IApiListEntry;

  constructor(apiListEntry: shared.IApiListEntry) {
    this._apiListEntry = apiListEntry;
  }

  async openAsync() {
    await openAsync(this._apiListEntry.providerName, this._apiListEntry.seriesName);
  }

  get key() {
    return `${this._apiListEntry.seriesTitle}/${this._apiListEntry.providerName}`;
  }

  get providerName() {
    return this._apiListEntry.providerName;
  }

  get seriesTitle() {
    return this._apiListEntry.seriesTitle;
  }
}
