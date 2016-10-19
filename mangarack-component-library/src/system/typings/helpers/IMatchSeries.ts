import * as mio from '../../module';

/**
 * Represents a series result.
 */
export interface IMatchSeries {
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
