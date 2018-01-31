import * as mio from '../';
import shared = mio.shared;

export class SeriesChapterViewModel {
  private _librarySeries: shared.ILibrarySeries;
  private _librarySeriesChapter: shared.ILibrarySeriesChapter;
  private _providerName: string;
  private _seriesName: string;

  constructor(providerName: string, seriesName: string, librarySeries: shared.ILibrarySeries, librarySeriesChapter: shared.ILibrarySeriesChapter) {
    this._librarySeries = librarySeries;
    this._librarySeriesChapter = librarySeriesChapter;
    this._providerName = providerName;
    this._seriesName = seriesName;
  }
  
  get name() {
    return shared.nameOf(this._librarySeries, this._librarySeriesChapter);
  }

  get uniqueKey() {
    return `${this._providerName}/${this._seriesName}/${this.name}`;
  }
}
