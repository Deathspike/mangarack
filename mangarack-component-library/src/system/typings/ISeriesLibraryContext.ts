import * as mio from '../module';

/**
 * Represents a series library context.
 */
export interface ISeriesLibraryContext {
  /**
   * Contains the next identifier.
   */
  nextId: number;

  /**
   * Contains each provider.
   */
  providers: {[providerName: string]: {
    /**
     * Contains each series.
     */
    series: {[seriesAddress: string]: mio.ISeriesLibraryContextItem}
  }};
}
