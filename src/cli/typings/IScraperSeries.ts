import * as mio from '../';

export interface IScraperSeries extends ISeries<mio.IScraperSeriesChapter> {
  closeAsync(): Promise<void>;
  imageAsync(): Promise<Buffer>;
  providerName: string;
}
