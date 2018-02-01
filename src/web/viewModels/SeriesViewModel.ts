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
    let apiSeries = await request.json() as shared.IApiSeries;
    let seriesChapters = apiSeries.chapters.map(apiSeriesChapter => new mio.SeriesChapterViewModel(this._providerName, this._seriesName, apiSeries, apiSeriesChapter));
    this.chapters = seriesChapters;
  }

  @mobx.observable
  chapters: mio.SeriesChapterViewModel[] | undefined;
}
