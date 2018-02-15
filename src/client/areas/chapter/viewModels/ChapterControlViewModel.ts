import * as mio from '../';
import * as mobx from 'mobx';
import shared = mio.shared;

export class ChapterControlViewModel {
  private readonly _listEntry: shared.IApiListEntry;
  private readonly _series: shared.IApiSeries;
  private readonly _seriesChapter: shared.IApiSeriesChapter;

  constructor(listEntry: shared.IApiListEntry, series: shared.IApiSeries, seriesChapter: shared.IApiSeriesChapter) {
    this._listEntry = listEntry;
    this._series = series;
    this._seriesChapter = seriesChapter;
  }

  @mobx.action
  async changeChapterAsync(name: string) {
    if (name !== this.chapterName) {
      for (let seriesChapter of this._series.chapters) {
        if (seriesChapter.name === name) {
          if (seriesChapter.downloaded) {
            await mio.layerViewModel.replaceAsync(mio.initializeAsync(this._listEntry, this._series, seriesChapter));
          } else {
            mio.toastViewModel.show(mio.language.SERIESCHAPTER_UNAVAILABLE);
          }
        }
      }
    }
  }

  @mobx.action
  close() {
    mio.layerViewModel.close();
  }

  @mobx.action
  hide() {
    this.visible = false;
  }
  
  @mobx.action
  show() {
    this.visible = true;
  }
  
  @mobx.computed
  get chapterName() {
    return this._seriesChapter.name;
  }

  @mobx.computed
  get seriesChapters() {
    return this._series.chapters.map(seriesChapter => new mio.series.SeriesChapterViewModel(this._listEntry, this._series, seriesChapter));
  }

  @mobx.observable
  visible = false;
}
