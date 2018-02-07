import * as mio from '../';
import * as mobx from 'mobx';
import shared = mio.shared;

export class ChapterViewModel {
  private readonly _listEntry: shared.IApiListEntry;
  private readonly _series: shared.IApiSeries;
  private readonly _seriesChapter: shared.IApiSeriesChapter;
  private _cache: mio.ImageCache;
  private _previousPageTime?: number;
  private _nextPageTime?: number;

  constructor(listEntry: shared.IApiListEntry, series: shared.IApiSeries, seriesChapter: shared.IApiSeriesChapter) {
    this._listEntry = listEntry;
    this._series = series;
    this._seriesChapter = seriesChapter;
  }

  @mobx.action
  close() {
    mio.layerViewModel.close(); // TODO: Double tap with notification to close.
  }

  @mobx.action
  async refreshAsync() {
    // Initialize the chapter.
    let request = await fetch(`/api/library/${encodeURIComponent(this._listEntry.providerName)}/${encodeURIComponent(this._listEntry.seriesTitle)}/${encodeURIComponent(this._seriesChapter.name)}`);
    let chapter = await request.json() as shared.IApiChapter;

    // Initialize the image cache.
    let imageCache = await new mio.ImageCache(this._listEntry, chapter.pageNames, request.url);
    let image = await imageCache.getImageAsync(this.currentPageNumber);
    this._cache = imageCache;

    // Initialize the view model.
    mobx.runInAction(() => {
      this.chapter = chapter;
      this.image = image;
    });
  }

  @mobx.action
  nextChapter() {
    mio.toastViewModel.show('TODO - NEXT CHAPTER ACTION');
  }

  @mobx.action
  async nextPageAsync() {
    if (this.chapter) {
      if (this.currentPageNumber < this.chapter.pageNames.length) {
        let image = await this._cache.getImageAsync(++this.currentPageNumber);
        mobx.runInAction(() => this.image = image);
      } else {
        let index = this._series.chapters.indexOf(this._seriesChapter);
        if (index !== -1) {
          if (index - 1 < 0) {
            this._nextPageTime = this._toastOrAction(() => this.close(), this._nextPageTime, 'TODO - NEXT CHAPTER (END REACHED)');
          } else if (this._series.chapters[index - 1].downloaded) {
            this._nextPageTime = this._toastOrAction(() => this.nextChapter(), this._nextPageTime, 'TODO - NEXT CHAPTER');
          } else {
            mio.toastViewModel.show('TODO - NEXT CHAPTER (NOT AVAILABLE)');
          }
        }
      }
    }
  }

  @mobx.action
  previousChapter() {
    mio.toastViewModel.show('TODO - PREVIOUS CHAPTER ACTION');
  }

  @mobx.action
  async previousPageAsync() {
    if (this.chapter && this.currentPageNumber > 1) {
      let image = await this._cache.getImageAsync(--this.currentPageNumber);
      mobx.runInAction(() => this.image = image);
    } else {
      let index = this._series.chapters.indexOf(this._seriesChapter);
      if (index !== -1) {
        if (index + 1 >= this._series.chapters.length) {
          this._previousPageTime = this._toastOrAction(() => this.close(), this._previousPageTime, 'TODO - PREVIOUS CHAPTER (END REACHED)');
        } else if (this._series.chapters[index + 1].downloaded) {
          this._previousPageTime = this._toastOrAction(() => this.previousChapter(), this._previousPageTime, 'TODO - PREVIOUS CHAPTER');
        } else {
          mio.toastViewModel.show('TODO - PREVIOUS CHAPTER (NOT AVAILABLE)');
        }
      }
    }
  }

  @mobx.observable
  chapter: shared.IApiChapter;

  @mobx.observable
  currentPageNumber = 1;

  @mobx.observable
  image: string;

  private _toastOrAction(action: () => void, clickTime: number | undefined, message: string) {
    let now = Date.now();
    if (clickTime && clickTime + shared.settings.clientActionTimeout >= now) {
      action();
      return now;
    } else {
      mio.toastViewModel.show(message);
      return now;
    }
  }
}
