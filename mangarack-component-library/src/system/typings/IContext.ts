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
   * Contains the password.
   */
  password: mio.IOption<string>;

  /**
   * Contains each provider.
   */
  providers: {[providerName: string]: mio.IContextProvider};

  /**
   * Contains each setting.
   */
  settings: {[key: string]: string};

  /**
   * Contains the version.
   */
  version: number;
}
