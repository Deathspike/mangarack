import * as mio from '../';
import * as mobx from 'mobx';
import shared = mio.shared;

export class ChapterPageViewModel {
  private readonly _listEntry: shared.IApiListEntry;
  private readonly _series: shared.IApiSeries;
  private readonly _seriesChapter: shared.IApiSeriesChapter;
  private readonly _seriesChapterSelector: mio.ChapterSelector;
  private readonly _wentBack: boolean;
  private _cache: mio.ImageCache;
  private _previousPageTime?: number;
  private _nextPageTime?: number;

  constructor(listEntry: shared.IApiListEntry, series: shared.IApiSeries, seriesChapter: shared.IApiSeriesChapter, wentBack: boolean) {
    this._listEntry = listEntry;
    this._series = series;
    this._seriesChapter = seriesChapter;
    this._seriesChapterSelector = new mio.ChapterSelector(series, seriesChapter);
    this._wentBack = wentBack;
  }

  @mobx.action
  async changeAsync(index: number) {
    this.pageIndex = index;
    let image = await this._cache.getImageAsync(index);
    mobx.runInAction(() => this.image = image);
  }

  @mobx.action
  async nextAsync() {
    if (this.chapter) {
      if (this.pageIndex + 1 < this.chapter.length) {
        await this.changeAsync(this.pageIndex + 1);
      } else {
        let nextSeriesChapter = this._seriesChapterSelector.fetchNext();
        if (!nextSeriesChapter) {
          mio.toastViewModel.show(mio.language.CHAPTER_NEXTCHAPTERNOT);
        } else if (!nextSeriesChapter.downloaded) {
          mio.toastViewModel.show(mio.language.CHAPTER_NEXTCHAPTERUNAVAILABLE);
        } else if (!this._nextPageTime || this._nextPageTime < Date.now()) {
          mio.toastViewModel.show(mio.language.CHAPTER_NEXTCHAPTER);
          this._nextPageTime = Date.now() + mio.settings.toastTimeout;
        } else {
          await mio.layerViewModel.replaceAsync(mio.initializeAsync(this._listEntry, this._series, nextSeriesChapter));
        }
      }
    }
  }

  @mobx.action
  async previousAsync() {
    if (this.chapter && this.pageIndex > 0) {
      await this.changeAsync(this.pageIndex - 1);
    } else {
      let previousSeriesChapter = this._seriesChapterSelector.fetchPrevious();
      if (!previousSeriesChapter) {
        mio.toastViewModel.show(mio.language.CHAPTER_PREVIOUSCHAPTERNOT);
      } else if (!previousSeriesChapter.downloaded) {
        mio.toastViewModel.show(mio.language.CHAPTER_PREVIOUSCHAPTERUNAVAILABLE);
      } else if (!this._previousPageTime || this._previousPageTime < Date.now()) {
        mio.toastViewModel.show(mio.language.CHAPTER_PREVIOUSCHAPTER);
        this._previousPageTime = Date.now() + mio.settings.toastTimeout;
      } else {
        await mio.layerViewModel.replaceAsync(mio.initializeAsync(this._listEntry, this._series, previousSeriesChapter, true));
      }
    }
  }

  @mobx.action
  async refreshAsync() {
    // Initialize the chapter.
    let request = await fetch(`/api/library/${encodeURIComponent(this._listEntry.providerName)}/${encodeURIComponent(this._listEntry.seriesTitle)}/${encodeURIComponent(this._seriesChapter.name)}`);
    let chapter = await request.json() as shared.IApiChapter;
    let pageIndex = this._wentBack ? chapter.length - 1 : 0;

    // Initialize the image cache.
    let imageCache = await new mio.ImageCache(chapter, this._listEntry, request.url);
    let image = await imageCache.getImageAsync(pageIndex);
    this._cache = imageCache;

    // Initialize the view model.
    mobx.runInAction(() => {
      this.chapter = chapter;
      this.image = image;
      this.pageIndex = pageIndex;
    });
  }
  
  @mobx.computed
  get pages() {
    return this.chapter.map((name, index) => {
      let c = name.indexOf('.');
      if (c !== -1) name = name.substr(0, c);
      return {name, index};
    }).reverse();
  }

  @mobx.observable
  chapter: shared.IApiChapter;

  @mobx.observable
  image: string;

  @mobx.observable
  pageIndex: number;
}
