import * as mio from '../../';
import {ScraperIterator} from './ScraperIterator';

export class ScraperSeriesChapter implements mio.IScraperSeriesChapter {
  private _browserTab: mio.BrowserTab;
  private _evaluatorSeriesChapter: IEvaluatorSeriesChapter;

  constructor(page: mio.BrowserTab, seriesItem: IEvaluatorSeriesChapter) {
    this._browserTab = page;
    this._evaluatorSeriesChapter = seriesItem;
  }

  async iteratorAsync() {
    return new ScraperIterator(await this._browserTab.tabAsync(this._evaluatorSeriesChapter.url));
  }
  
  get number() {
    return this._evaluatorSeriesChapter.number;
  }

  get title() {
    return this._evaluatorSeriesChapter.title;
  }
  
  get volume() {
    return this._evaluatorSeriesChapter.volume;
  }
}
