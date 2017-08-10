import * as mio from '../../module';

/**
 * Represents a context provider.
 */
export interface IContextProvider {
  /**
   * Contains each series.
   */
  series: {[seriesAddress: string]: mio.IContextSeries};
}
