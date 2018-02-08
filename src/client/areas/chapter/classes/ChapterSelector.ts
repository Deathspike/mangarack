import * as mio from '../';
import shared = mio.shared;

export class ChapterSelector {
  private readonly _series: shared.IApiSeries;
  private readonly _seriesChapter: shared.IApiSeriesChapter;

  constructor(series: shared.IApiSeries, seriesChapter: shared.IApiSeriesChapter) {
    this._series = series;
    this._seriesChapter = seriesChapter;
  }

  fetchPrevious() {
    let index = this._series.chapters.indexOf(this._seriesChapter);
    if (index === -1) return undefined;
    return index + 1 < this._series.chapters.length ? this._series.chapters[index + 1] : undefined;
  }

  fetchNext() {
    let index = this._series.chapters.indexOf(this._seriesChapter);
    if (index === -1) return undefined;
    return index - 1 >= 0 ? this._series.chapters[index - 1] : undefined;
  }
}
