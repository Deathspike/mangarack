import * as mio from '../module';

/**
 * Represents the context.
 */
export interface IContext {
  /**
   * Contains the last used identifier.
   */
  lastId: number;

  /**
   * Contains each provider.
   */
  providers: {[providerName: string]: {
    /**
     * Contains each series.
     */
    series: {[seriesAddress: string]: mio.IContextSeries}
  }};

  /**
   * Contains each user.
   */
  users: {[userName: string]: mio.IContextUser};
}
