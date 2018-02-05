import * as mio from '../';
import {openAsync} from '../../chapter';
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
  
  async openAsync() {
    if (this.downloaded) {
      await openAsync(this._providerName, this._seriesName, shared.nameOf(this._apiSeries, this._apiSeriesChapter));
    } else {
      mio.toastViewModel.show(`${this.name} is not locally available`);
    }
  }

  get downloaded() {
    return this._apiSeriesChapter.downloaded;
  }

  get exists() {
    return this._apiSeriesChapter.exists;
  }
  
  get name() {
    return shared.nameOf(this._apiSeries, this._apiSeriesChapter, true);
  }
}
