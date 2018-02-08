import * as mio from '../';
import {initializeAsync} from '../../series';
import shared = mio.shared;

export class ListEntryViewModel {
  private readonly _listEntry: shared.IApiListEntry;

  constructor(listEntry: shared.IApiListEntry) {
    this._listEntry = listEntry;
  }

  async openAsync() {
    await mio.layerViewModel.openAsync(initializeAsync(this._listEntry));
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
