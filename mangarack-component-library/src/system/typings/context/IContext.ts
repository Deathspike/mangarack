import * as mio from '../../module';

/**
 * Represents the context.
 */
export interface IContext {
  /**
   * Contains the last series identifier.
   */
  lastSeriesId: number;

  /**
   * Contains the password.
   */
  password: string;

  /**
   * Contains each provider.
   */
  providers: {[providerName: string]: mio.IContextProvider};

  /**
   * Contains each setting.
   */
  settings: mio.IDictionary;

  /**
   * Contains the version.
   */
  version: number;
}
