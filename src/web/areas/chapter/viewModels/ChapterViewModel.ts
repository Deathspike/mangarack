import * as mio from '../';
import * as mobx from 'mobx';
import shared = mio.shared;

// TODO: I should probably already render the next page too, to avoid those delays, and just swap out the image buffers..
export class ChapterViewModel {
  private _cache: ImageCache;
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
    history.back(); // TODO: double tap with notification
  }

  @mobx.action
  async refreshAsync() {
    let providerComponent = encodeURIComponent(this._providerName)
    let seriesComponent = encodeURIComponent(this._seriesName);
    let chapterComponent = encodeURIComponent(this._chapterName);
    let url = `/api/library/${providerComponent}/${seriesComponent}/${chapterComponent}`;

    let request = await fetch(url);
    this.chapter = await request.json() as shared.IApiChapter;

    this._cache = await new ImageCache(this.chapter.pages, url, this._providerName);
    this.img = await this._cache.getImageAsync(this.currentPageNumber);
    this._cache.preloadImage(this.currentPageNumber + 1);
  }

  @mobx.action
  async nextPageAsync() {
    if (this.chapter && this.currentPageNumber < this.chapter.pages.length) {
      this.currentPageNumber++;
      this.img = await this._cache.getImageAsync(this.currentPageNumber);
      this._cache.preloadImage(this.currentPageNumber + 1);
    } else {
      alert('TODO: Next chapter');
    }
  }

  @mobx.action
  async previousPageAsync() {
    if (this.chapter && this.currentPageNumber > 1) {
      this.currentPageNumber--
      this.img = await this._cache.getImageAsync(this.currentPageNumber);
      this._cache.preloadImage(this.currentPageNumber - 1);
    } else {
      alert('TODO: Previous chapter');
    }
  }

  @mobx.observable
  chapter: shared.IApiChapter;

  @mobx.observable
  currentPageNumber = 1;

  @mobx.observable
  img: string;
}

// TODO: Due to the preload saving mechanism, the previous page is always lost. Not that useful.
// TODO: Move pre-loads into the cache mechanism upon accessing a page.
class ImageCache {
  private _apiPages: shared.IApiChapterPage[];
  private _apiUrl: string;
  private _images: (Promise<string> | string | undefined)[];
  private _providerName: string;

  constructor(apiPages: shared.IApiChapterPage[], apiUrl: string, providerName: string) {
    this._apiPages = apiPages;
    this._apiUrl = apiUrl;
    this._images = apiPages.map(() => undefined);
    this._providerName = providerName;
  }

  async getImageAsync(number: number) {
    let index = number - 1;
    let value = this._images[index];
    if (typeof value === 'string') {
      return value;
    } else if (value) {
      return await value;
    } else {
      return this._images[index] = this._fetchImage(index).then(image => this._storeImage(image, index));
    }
  }

  preloadImage(number: number) {
    let index = number - 1;
    if (index >= 0 && index < this._images.length) {
      this.getImageAsync(number);
    }
  }

  private _cleanCache(index: number) {
    for (let i = 0; i < this._images.length; i++) {
      if ((i !== index - 1) && (i !== index) && (i !== index + 1)) {
        this._images[i] = undefined;
      }
    }
  }

  private _storeImage(image: string, index: number) {
    this._cleanCache(index);
    this._images[index] = image;
    return image;
  }

  private async _fetchImage(index: number) {
    let pageName = this._apiPages[index].name;
    let request = await fetch(`${this._apiUrl}/${encodeURIComponent(pageName)}`);
    let buffer = await request.blob();
    if (this._providerName === 'mangafox') {
      return await mio.mangafoxImageAsync(buffer)
    } else {
      return URL.createObjectURL(buffer);
    }
  }
}