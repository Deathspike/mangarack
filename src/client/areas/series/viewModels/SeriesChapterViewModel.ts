import * as mio from '../';
import {initializeAsync} from '../../chapter';
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
      await mio.layerViewModel.openAsync(initializeAsync(this._listEntry, this._series, this._seriesChapter));
    } else {
      mio.toastViewModel.show(mio.language.SERIESCHAPTER_NOTAVAILABLE);
    }
  }

  get downloaded() {
    return this._seriesChapter.downloaded;
  }
  
  get friendlyName() {
    let n = String(this._seriesChapter.number);
    let c =  n.indexOf('.') >= 0 ? n.substr(0, n.indexOf('.')).padStart(3, '0') + n.substr( n.indexOf('.')) : n.padStart(3, '0');
    if (typeof this._seriesChapter.volume !== 'undefined') {
      return `v${String(this._seriesChapter.volume).padStart(2, '0')} c${c}`;
    } else {
      return `c${c}`;
    }
  }
  
  get name() {
    return this._seriesChapter.name;
  }
}
