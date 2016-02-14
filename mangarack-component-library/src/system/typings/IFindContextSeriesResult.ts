import * as mio from '../module';

/**
 * Represents a context series result.
 */
export interface IFindContextSeriesResult {
  /**
   * Contains the provider.
   */
  provider: mio.IContextProvider;

  /**
   * Contains the provider name.
   */
  providerName: string;

  /**
   * Contains the series.
   */
  series: mio.IContextSeries;

  /**
   * Contains the series address.
   */
  seriesAddress: string;
}
