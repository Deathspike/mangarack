import * as mio from '../';

export interface IStoreSeriesItem extends ISeriesItem {
  readonly pages: mio.IStoreSeriesItemPage[];
}

