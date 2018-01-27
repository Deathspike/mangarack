import * as mio from '../';

export interface IProviderSeriesItem extends ISeriesItem {
  iteratorAsync(): Promise<mio.IProviderIterator>
}
