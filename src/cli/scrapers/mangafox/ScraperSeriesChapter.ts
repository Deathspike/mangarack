import * as mio from '../../';
import {ScraperIterator} from './ScraperIterator';

export class ScraperSeriesChapter implements mio.IScraperSeriesChapter {
  private readonly _browserTab: mio.BrowserTab;
  private readonly _seriesChapter: IEvaluatorSeriesChapter;

  constructor(page: mio.BrowserTab, seriesItem: IEvaluatorSeriesChapter) {
    this._browserTab = page;
    this._seriesChapter = seriesItem;
  }

  async iteratorAsync() {
    return new ScraperIterator(await this._browserTab.tabAsync(this._seriesChapter.url));
  }
  
  get name() {
    return this._seriesChapter.name;
  }
  
  get number() {
    return this._seriesChapter.number;
  }

  get title() {
    return this._seriesChapter.title;
  }
  
  get volume() {
    return this._seriesChapter.volume;
  }
}
