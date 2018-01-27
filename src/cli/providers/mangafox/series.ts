import * as mio from '../../';
import {SeriesItem} from './seriesItem';

export class Series implements mio.IProviderSeries {
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

  closeAsync() {
    return this._browserTab.closeAsync();
  }

  imageAsync() {
    return this._browserTab.bufferAsync(this._series.imageUrl);
  }

  get genres() {
    return this._series.genres;
  }

  get items() {
    return this._series.items.map(item => new SeriesItem(this._browserTab, item));
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
