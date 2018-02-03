import * as mio from '../';
import shared = mio.shared;

export class SeriesChapterViewModel {
  private _apiSeries: shared.IApiSeries;
  private _apiSeriesChapter: shared.IApiSeriesChapter;
  private _providerName: string;
  private _seriesName: string;

  constructor(providerName: string, seriesName: string, apiSeries: shared.IApiSeries, apiSeriesChapter: shared.IApiSeriesChapter) {
    this._apiSeries = apiSeries;
    this._apiSeriesChapter = apiSeriesChapter;
    this._providerName = providerName;
    this._seriesName = seriesName;
  }
  
  tryNavigateTo() {
    if (this.exists) {
      location.href = '#'+ this.url;
    }
  }

  get exists() {
    return this._apiSeriesChapter.exists;
  }
  
  get name() {
    return shared.nameOf(this._apiSeries, this._apiSeriesChapter);
  }

  get uniqueKey() {
    return `${this._providerName}/${this._seriesName}/${this.name}`;
  }

  get url() {
    return `/${encodeURIComponent(this._providerName)}/${encodeURIComponent(this._seriesName)}/${encodeURIComponent(this.name)}`;
  }
}
