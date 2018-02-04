import * as mio from '../';
import {createAsync} from '../../series';
import shared = mio.shared;

export class ListEntryViewModel {
  private _apiListEntry: shared.IApiListEntry;

  constructor(apiListEntry: shared.IApiListEntry) {
    this._apiListEntry = apiListEntry;
  }

  get displayName() {
    return this._apiListEntry.seriesTitle;
  }

  get providerName() {
    return this._apiListEntry.providerName;
  }

  get uniqueKey() {
    return `${this._apiListEntry.providerName}/${this._apiListEntry.seriesName}`;
  }

  navigateTo() {
    createAsync(this._apiListEntry.providerName, this._apiListEntry.seriesName);
  }
}
