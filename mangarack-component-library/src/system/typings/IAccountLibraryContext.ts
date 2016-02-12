import * as mio from '../module';

/**
 * Represents an account library context.
 */
export interface IAccountLibraryContext {
  /**
   * Contains each account.
   */
  accounts: {[accountName: string]: mio.IAccountLibraryContextItem};

  /**
   * Contains the next identifier.
   */
  nextId: number;
}
