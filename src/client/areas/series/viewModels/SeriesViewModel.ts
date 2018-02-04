import * as mio from '../';
import * as mobx from 'mobx';
import shared = mio.shared;

export class SeriesViewModel {
  private _apiSeries: shared.IApiSeries;
  private _providerName: string;
  private _seriesName: string;

  constructor(providerName: string, seriesName: string) {
    this._providerName = providerName;
    this._seriesName = seriesName;
  }

  @mobx.action
  async refreshAsync() {
    let request = await fetch(`/api/library/${encodeURIComponent(this._providerName)}/${encodeURIComponent(this._seriesName)}`);
    this._apiSeries = await request.json() as shared.IApiSeries;
    this.chapters = this._apiSeries.chapters.map(apiSeriesChapter => new mio.SeriesChapterViewModel(this._providerName, this._seriesName, this._apiSeries, apiSeriesChapter));
  }

  @mobx.computed
  get title() {
    return this._apiSeries.title;
  }

  @mobx.observable
  chapters: mio.SeriesChapterViewModel[];
}
