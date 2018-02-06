import * as mio from '../../';
import {ScraperSeriesChapter} from './ScraperSeriesChapter';

export class ScraperSeries implements mio.IScraperSeries {
  private _browserTab: mio.BrowserTab;
  private _series: IEvaluatorSeries;

  constructor(browserTab: mio.BrowserTab, series: IEvaluatorSeries) {
    this._browserTab = browserTab;
    this._series = series;
  }

  get artists() {
    return this._series.artists;
  }

  get authors() {
    return this._series.authors;
  }

  get chapters() {
    return this._series.chapters.map(seriesChapter => new ScraperSeriesChapter(this._browserTab, seriesChapter));
  }

  closeAsync() {
    return this._browserTab.closeAsync();
  }

  imageAsync() {
    return this._browserTab.bufferAsync(this._series.imageUrl);
  }

  get genres() {
    return this._series.genres;
  }

  get providerName() {
    return 'mangafox';
  }
  
  get summary() {
    return this._series.summary;
  }

  get title() {
    return this._series.title;
  }
  
  get type() {
    return this._series.type;
  }

  get url() {
    return this._series.url;
  }
}
