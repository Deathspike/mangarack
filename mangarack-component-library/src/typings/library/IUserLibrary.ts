import * as mio from '../../default';

/**
 * Represents an user library.
 */
export interface IUserLibrary {
  /**
   * Promises to create an user.
   * @param userName The user name.
   * @param password The password.
   * @return The promise to create an user.
   */
  createAsync(userName: string, password: string): Promise<mio.IOption<number>>;

  /**
   * Promises to delete the chapter.
   * @param chapterId The chapter identifier.
   * @return The promise to delete the chapter.
   */
  deleteAsync(userId: number): Promise<boolean>;

  /**
   * Promises a series library for the user.
   * @param userId The user identifier.
   * @return The promise for the series library for the user.
   */
  seriesAsync(userId: number): Promise<mio.IOption<mio.ISeriesLibrary>>;

  /**
   * Promises to update the user password.
   * @param userId The user identifier.
   * @param password The password.
   * @return The promise to update the user password.
   */
  updateAsync(userId: number, password: string): Promise<boolean>;

  /**
   * Promises a list of users.
   * @return The promise for the list of users.
   */
  viewAsync(): Promise<mio.IUserLibraryItem[]>;
}
