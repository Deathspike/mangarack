import * as mio from '../';
import * as mobx from 'mobx';
import shared = mio.shared;

export class SeriesViewModel {
  private _providerName: string;
  private _seriesName: string;

  constructor(providerName: string, seriesName: string) {
    this._providerName = providerName;
    this._seriesName = seriesName;
  }

  @mobx.action
  async fetchAsync() {
    let request = await fetch(`/api/library/${encodeURIComponent(this._providerName)}/${encodeURIComponent(this._seriesName)}`);
    let response = await request.json();
    this.currentData = response;
  }

  @mobx.observable
  currentData: shared.ILibrarySeries | undefined;

  @mobx.observable
  providerName: string;

  @mobx.observable
  seriesName: string;
}
