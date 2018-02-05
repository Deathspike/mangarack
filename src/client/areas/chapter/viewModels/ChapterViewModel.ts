import * as mio from '../';
import * as mobx from 'mobx';
import shared = mio.shared;

export class ChapterViewModel {
  private _cache: mio.CacheViewModel;
  private _providerName: string;
  private _seriesName: string;
  private _chapterName: string;

  constructor(providerName: string, seriesName: string, chapterName: string) {
    this._providerName = providerName;
    this._seriesName = seriesName;
    this._chapterName = chapterName;
  }

  @mobx.action
  close() {
    mio.layerViewModel.close(); // TODO: Double tap with notification to close.
  }

  @mobx.action
  async refreshAsync() {
    // Initialize the chapter.
    let request = await fetch(`/api/library/${encodeURIComponent(this._providerName)}/${encodeURIComponent(this._seriesName)}/${encodeURIComponent(this._chapterName)}`);
    let apiChapter = await request.json() as shared.IApiChapter;

    // Initialize the image cache.
    let imageCache = await new mio.CacheViewModel(apiChapter.pages, request.url, this._providerName);
    let image = await imageCache.getImageAsync(this.currentPageNumber);
    this._cache = imageCache;

    // Initialize the view model.
    mobx.runInAction(() => {
      this.chapter = apiChapter;
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
