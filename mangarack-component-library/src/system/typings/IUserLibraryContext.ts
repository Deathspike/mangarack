import * as mio from '../module';

/**
 * Represents an user library context.
 */
export interface IUserLibraryContext {
  /**
   * Contains each user.
   */
  users: {[userName: string]: mio.IUserLibraryContextItem};

  /**
   * Contains the next identifier.
   */
  nextId: number;
}
