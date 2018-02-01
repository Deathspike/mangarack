import * as mio from '../';
import * as mobx from 'mobx';
import shared = mio.shared;

export class ChapterViewModel {
  private _apiUrl: string;

  constructor(providerName: string, seriesName: string, chapterName: string) {
    let providerPiece = encodeURIComponent(providerName)
    let seriesPiece = encodeURIComponent(seriesName);
    let chapterPiece = encodeURIComponent(chapterName);
    this._apiUrl = `/api/library/${providerPiece}/${seriesPiece}/${chapterPiece}`;
  }

  @mobx.action
  async fetchAsync() {
    let request = await fetch(this._apiUrl);
    let apiChapter = await request.json() as shared.IApiChapter;
    this.chapter = apiChapter;
  }

  @mobx.computed
  get imageUrl() {
    if (this.chapter) {
      let pageName = this.chapter.pages[this.currentPageNumber - 1].name;
      let pagePiece = encodeURIComponent(pageName);
      return `${this._apiUrl}/${pagePiece}`;
    } else {
      return undefined;
    }
  }

  @mobx.observable
  chapter: shared.IApiChapter | undefined;

  @mobx.observable
  currentPageNumber = 1;
}
