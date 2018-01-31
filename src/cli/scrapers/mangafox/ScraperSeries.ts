import * as mio from '../../';
import {ScraperSeriesChapter} from './ScraperSeriesChapter';

export class ScraperSeries implements mio.IScraperSeries {
  private _browserTab: mio.BrowserTab;
  private _evaluatorSeries: IEvaluatorSeries;

  constructor(browserTab: mio.BrowserTab, series: IEvaluatorSeries) {
    this._browserTab = browserTab;
    this._evaluatorSeries = series;
  }

  get artists() {
    return this._evaluatorSeries.artists;
  }

  get authors() {
    return this._evaluatorSeries.authors;
  }

  get chapters() {
    return this._evaluatorSeries.chapters.map(evaluatorSeriesChapter => new ScraperSeriesChapter(this._browserTab, evaluatorSeriesChapter));
  }

  closeAsync() {
    return this._browserTab.closeAsync();
  }

  imageAsync() {
    return this._browserTab.bufferAsync(this._evaluatorSeries.imageUrl);
  }

  get genres() {
    return this._evaluatorSeries.genres;
  }

  get providerName() {
    return 'mangafox';
  }
  
  get name() {
    return this._evaluatorSeries.name;
  }

  get summary() {
    return this._evaluatorSeries.summary;
  }

  get type() {
    return this._evaluatorSeries.type;
  }

  get url() {
    return this._evaluatorSeries.url;
  }
}
