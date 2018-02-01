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
    let librarySeries = await request.json() as shared.ILibrarySeries;
    let seriesChapters = librarySeries.chapters.map(librarySeriesChapter => new mio.SeriesChapterViewModel(this._providerName, this._seriesName, librarySeries, librarySeriesChapter));
    this.chapters = seriesChapters;
  }

  @mobx.observable
  chapters: mio.SeriesChapterViewModel[] | undefined;
}
