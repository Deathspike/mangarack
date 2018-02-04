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
  async refreshAsync() {
    let request = await fetch(`/api/library/${encodeURIComponent(this._providerName)}/${encodeURIComponent(this._seriesName)}`);
    let apiSeries = await request.json() as shared.IApiSeries;
    this.chapters = apiSeries.chapters.map(apiSeriesChapter => new mio.SeriesChapterViewModel(this._providerName, this._seriesName, apiSeries, apiSeriesChapter));
    this.title = apiSeries.title;
  }

  @mobx.observable
  chapters: mio.SeriesChapterViewModel[];

  @mobx.observable
  title: string;
}
