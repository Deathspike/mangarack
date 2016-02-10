import * as mio from '../../default';

/**
 * Represents an account library.
 */
export interface IAccountLibrary {
  /**
   * Promises to create an account.
   * @param accountName The account name.
   * @param password The password.
   * @return The promise to create an account.
   */
  createAsync(accountName: string, password: string): Promise<mio.IOption<number>>;

  /**
   * Promises to delete the chapter.
   * @param chapterId The chapter identifier.
   * @return The promise to delete the chapter.
   */
  deleteAsync(accountId: number): Promise<boolean>;

  /**
   * Promises a series library for the account.
   * @param accountId The account identifier.
   * @return The promise for the series library for the account.
   */
  seriesAsync(accountId: number): Promise<mio.IOption<mio.ISeriesLibrary>>;

  /**
   * Promises to update the account password.
   * @param accountId The account identifier.
   * @param password The password.
   * @return The promise to update the account password.
   */
  updateAsync(accountId: number, password: string): Promise<boolean>;

  /**
   * Promises a list of accounts.
   * @return The promise for the list of accounts.
   */
  viewAsync(): Promise<mio.IAccountLibraryItem[]>;
}
