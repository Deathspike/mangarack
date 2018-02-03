import * as mio from '../';
import * as mobx from 'mobx';
import shared = mio.shared;
import {processMangafoxImageAsync} from '../utilities/mangafoxImageProcessor';

// TODO: Cache next image.
export class ChapterViewModel {
  private _apiUrl: string;
  private _providerName: string;

  constructor(providerName: string, seriesName: string, chapterName: string) {
    let providerPiece = encodeURIComponent(providerName)
    let seriesPiece = encodeURIComponent(seriesName);
    let chapterPiece = encodeURIComponent(chapterName);
    this._apiUrl = `/api/library/${providerPiece}/${seriesPiece}/${chapterPiece}`;
    this._providerName = providerName;
  }

  @mobx.action
  close() {
    alert('TODO: Close chapter');
  }

  @mobx.action
  async refreshAsync() {
    let request = await fetch(this._apiUrl);
    let apiChapter = await request.json() as shared.IApiChapter;
    this.chapter = apiChapter;
    await this._updateImageAsync();
  }

  private async _updateImageAsync() {
    let pageName = this.chapter.pages[this.currentPageNumber - 1].name;
    let request = await fetch(`${this._apiUrl}/${encodeURIComponent(pageName)}`);
    let buffer = await request.blob();
    if (this._providerName === 'mangafox') {
      this.img = await processMangafoxImageAsync(buffer)
    } else {
      this.img = URL.createObjectURL(buffer);
    }
  }

  @mobx.action
  async nextPageAsync() {
    if (this.chapter && this.currentPageNumber < this.chapter.pages.length) {
      this.currentPageNumber++;
      await this._updateImageAsync();
    } else {
      alert('TODO: Next chapter');
    }
  }

  @mobx.action
  async previousPageAsync() {
    if (this.chapter && this.currentPageNumber > 1) {
      this.currentPageNumber--
      await this._updateImageAsync();
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
