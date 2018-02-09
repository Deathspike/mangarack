import * as mio from '../';
import shared = mio.shared;

export class ImageCache {
  private readonly _chapter: shared.IApiChapter;
  private readonly _listEntry: shared.IApiListEntry;
  private readonly _images: (Promise<string> | string | undefined)[];
  private readonly _url: string;

  constructor(chapter: shared.IApiChapter, listEntry: shared.IApiListEntry, url: string) {
    this._chapter = chapter;
    this._listEntry = listEntry;
    this._images = chapter.map(() => undefined);
    this._url = url;
  }

  async getImageAsync(number: number) {
    let index = number - 1;
    let image = this._images[index];
    this._expireCache(index);
    if (typeof image === 'string') {
      this._startPreloadImage(index - 1);
      this._startPreloadImage(index + 1);
      return image;
    } else if (image) {
      let wrapValue = image;
      return mio.loadingViewModel.loadAsync(() => wrapValue);
    } else {
      return this._images[index] = mio.loadingViewModel.loadAsync(async () => {
        let image = await this._fetchImage(index);
        this._startPreloadImage(index - 1);
        this._startPreloadImage(index + 1);
        return image;
      });
    }
  }

  private _expireCache(index: number) {
    for (let i = 0; i < this._images.length; i++) {
      if ((i !== index - 1) && (i !== index) && (i !== index + 1)) {
        this._images[i] = undefined;
      }
    }
  }

  private async _fetchImage(index: number) {
    let request = await fetch(`${this._url}/${encodeURIComponent(this._chapter[index])}`);
    let image = await this.processAsync(await request.blob())
    this._images[index] = image;
    return image;
  }

  private async processAsync(buffer: Blob) {
    if (this._listEntry.providerName === 'mangafox') {
      return await mio.mangafoxImageAsync(buffer)
    } else {
      return URL.createObjectURL(buffer);
    }
  }

  private _startPreloadImage(index: number) {
    if (index >= 0 && index < this._images.length && !this._images[index]) {
      this._images[index] = this._fetchImage(index);
    }
  }
}
