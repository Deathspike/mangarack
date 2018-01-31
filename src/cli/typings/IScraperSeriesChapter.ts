import * as mio from '../';

export interface IScraperSeriesChapter extends ISeriesChapter {
  iteratorAsync(): Promise<mio.IScraperIterator>
}
