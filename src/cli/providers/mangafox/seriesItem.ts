import * as mio from '../../';
import {Iterator} from './iterator';

export class SeriesItem implements mio.IProviderSeriesItem {
  private _browserTab: mio.BrowserTab;
  private _seriesItem: IEvaluatorSeriesItem;

  constructor(page: mio.BrowserTab, seriesItem: IEvaluatorSeriesItem) {
    this._browserTab = page;
    this._seriesItem = seriesItem;
  }

  async iteratorAsync() {
    return new Iterator(await this._browserTab.tabAsync(this._seriesItem.url));
  }
  
  get number() {
    return this._seriesItem.number;
  }

  get title() {
    return this._seriesItem.title;
  }

  get volume() {
    return this._seriesItem.volume;
  }
}
