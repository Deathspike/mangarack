import * as mio from '../';
import * as mobx from 'mobx';
import shared = mio.shared;

export class SeriesViewModel {
  private readonly _listEntry: shared.IApiListEntry;

  constructor(listEntry: shared.IApiListEntry) {
    this._listEntry = listEntry;
  }

  @mobx.action
  async refreshAsync() {
    let request = await fetch(`/api/library/${encodeURIComponent(this._listEntry.providerName)}/${encodeURIComponent(this._listEntry.seriesName)}`);
    let series = await request.json() as shared.IApiSeries;
    this.chapters = series.chapters.map(seriesChapter => new mio.SeriesChapterViewModel(this._listEntry, series, seriesChapter));
    this.title = series.title;
  }

  @mobx.observable
  chapters: mio.SeriesChapterViewModel[];

  @mobx.observable
  title: string;
}
