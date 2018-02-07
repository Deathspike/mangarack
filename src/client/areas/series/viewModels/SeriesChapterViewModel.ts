import * as mio from '../';
import {openAsync} from '../../chapter';
import shared = mio.shared;

export class SeriesChapterViewModel {
  private readonly _listEntry: shared.IApiListEntry;
  private readonly _series: shared.IApiSeries;
  private readonly _seriesChapter: shared.IApiSeriesChapter;

  constructor(listEntry: shared.IApiListEntry, series: shared.IApiSeries, seriesChapter: shared.IApiSeriesChapter) {
    this._listEntry = listEntry;
    this._series = series;
    this._seriesChapter = seriesChapter;
  }
  
  async openAsync() {
    if (this.downloaded) {
      await openAsync(this._listEntry, this._series, this._seriesChapter);
    } else {
      mio.toastViewModel.show(mio.language.SERIESCHAPTER_NOTAVAILABLE);
    }
  }

  get downloaded() {
    return this._seriesChapter.downloaded;
  }

  get exists() {
    return this._seriesChapter.exists;
  }
  
  get name() {
    return shared.nameOf(this._series.title, this._seriesChapter, true);
  }
}
