import * as mio from '../';
import {createAsync} from '../../chapter';
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
      createAsync(this._providerName, this._seriesName, this.name);
    }
  }

  get exists() {
    return this._apiSeriesChapter.downloaded;
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
