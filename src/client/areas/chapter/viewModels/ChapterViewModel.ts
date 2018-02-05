import * as mio from '../';
import * as mobx from 'mobx';
import shared = mio.shared;

// TODO: I should probably already render the next page too, to avoid those delays, and just swap out the image buffers..
export class ChapterViewModel {
  private _cache: mio.ImageCache;
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
    let providerComponent = encodeURIComponent(this._providerName)
    let seriesComponent = encodeURIComponent(this._seriesName);
    let chapterComponent = encodeURIComponent(this._chapterName);
    let url = `/api/library/${providerComponent}/${seriesComponent}/${chapterComponent}`;

    let request = await fetch(url);
    let chapter = await request.json() as shared.IApiChapter;

    this._cache = await new mio.ImageCache(chapter.pages, url, this._providerName);
    let image = await this._cache.getImageAsync(this.currentPageNumber);

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
      alert('TODO: Next chapter');
    }
  }

  @mobx.action
  async previousPageAsync() {
    if (this.chapter && this.currentPageNumber > 1) {
      let image = await this._cache.getImageAsync(--this.currentPageNumber);
      mobx.runInAction(() => this.image = image);
    } else {
      alert('TODO: Previous chapter');
    }
  }

  @mobx.observable
  chapter: shared.IApiChapter;

  @mobx.observable
  currentPageNumber = 1;

  @mobx.observable
  image: string;
}
