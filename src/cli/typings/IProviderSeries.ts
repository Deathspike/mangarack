import * as mio from '../';

export interface IProviderSeries extends ISeries<mio.IProviderSeriesItem> {
  closeAsync(): Promise<void>;
  imageAsync(): Promise<Buffer>;
  readonly providerName: string;
}
