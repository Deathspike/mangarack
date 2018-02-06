import * as mio from '../';
import * as mobx from 'mobx';
import shared = mio.shared;

export class ChapterViewModel {
  private _cache: mio.CacheViewModel;
  private _listEntry: shared.IApiListEntry;
  private _seriesChapter: shared.IApiSeriesChapter;

  constructor(listEntry: shared.IApiListEntry, seriesChapter: shared.IApiSeriesChapter) {
    this._listEntry = listEntry;
    this._seriesChapter = seriesChapter;
  }

  @mobx.action
  close() {
    mio.layerViewModel.close(); // TODO: Double tap with notification to close.
  }

  @mobx.action
  async refreshAsync() {
    // Initialize the chapter.
    let chapterName = shared.nameOf(this._listEntry.seriesTitle, this._seriesChapter);
    let request = await fetch(`/api/library/${encodeURIComponent(this._listEntry.providerName)}/${encodeURIComponent(this._listEntry.seriesName)}/${encodeURIComponent(chapterName)}`);
    let chapter = await request.json() as shared.IApiChapter;

    // Initialize the image cache.
    let imageCache = await new mio.CacheViewModel(this._listEntry, chapter.pages, request.url);
    let image = await imageCache.getImageAsync(this.currentPageNumber);
    this._cache = imageCache;

    // Initialize the view model.
    mobx.runInAction(() => {
      this.chapter = chapter;
      this.image = image;
    });
  }

  @mobx.action
  async nextPageAsync() {
    if (this.chapter && this.currentPageNumber < this.chapter.pages.length) {
      let image = await this._cache.getImageAsync(++this.currentPageNumber);
      mobx.runInAction(() => this.image = image);
    } else {
      mio.toastViewModel.show('TODO - NEXT CHAPTER');
    }
  }

  @mobx.action
  async previousPageAsync() {
    if (this.chapter && this.currentPageNumber > 1) {
      let image = await this._cache.getImageAsync(--this.currentPageNumber);
      mobx.runInAction(() => this.image = image);
    } else {
      mio.toastViewModel.show('TODO - PREVIOUS CHAPTER');
    }
  }

  @mobx.observable
  chapter: shared.IApiChapter;

  @mobx.observable
  currentPageNumber = 1;

  @mobx.observable
  image: string;
}
