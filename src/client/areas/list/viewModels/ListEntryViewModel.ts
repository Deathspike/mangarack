import * as mio from '../';
import {openAsync} from '../../series';
import shared = mio.shared;

export class ListEntryViewModel {
  private _listEntry: shared.IApiListEntry;

  constructor(listEntry: shared.IApiListEntry) {
    this._listEntry = listEntry;
  }

  async openAsync() {
    await openAsync(this._listEntry.providerName, this._listEntry.seriesName);
  }

  get key() {
    return `${this._listEntry.seriesTitle}/${this._listEntry.providerName}`;
  }

  get providerName() {
    return this._listEntry.providerName;
  }

  get seriesTitle() {
    return this._listEntry.seriesTitle;
  }
}
