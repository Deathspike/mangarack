import * as mio from '../module';

/**
 * Represents an account section.
 */
export class AccountSection implements mio.IAccountLibrary {
  private _context: mio.IAccountLibraryContext;

  /**
   * Initializes a new instance of the AccountSection class.
   * @param context The context.
   */
  constructor(context: mio.IAccountLibraryContext) {
    this._context = context;
  }

  /**
   * Promises to create an account.
   * @param accountName The account name.
   * @param password The password.
   * @return The promise to create an account.
   */
  async createAsync(accountName: string, password: string): Promise<mio.IOption<number>> {
    if (this._context.accounts[accountName]) {
      return mio.option<number>();
    } else {
      let account = {id: this._context.nextId++, password: password};
      this._context.accounts[accountName] = account;
      await mio.sectionService.writeAccountContextAsync(this._context);
      return mio.option(account.id);
    }
  }

  /**
   * Promises to delete the chapter.
   * @param chapterId The chapter identifier.
   * @return The promise to delete the chapter.
   */
  deleteAsync(accountId: number): Promise<boolean> {
    throw new Error('Not yet implemented');
  }

  /**
   * Determines whether the account name and password combination is valid.
   * @param accountName The account name.
   * @param password The password.
   * @return Indicates whether the account name and password combination is valid.
   */
  isValid(accountName: string, password: string): boolean {
    throw new Error('Not yet implemented');
  }

  /**
   * Promises a series library for the account.
   * @param accountId The account identifier.
   * @return The promise for the series library for the account.
   */
  seriesAsync(accountId: number): Promise<mio.IOption<mio.ISeriesLibrary>> {
    throw new Error('Not yet implemented');
  }

  /**
   * Promises to update the account password.
   * @param accountId The account identifier.
   * @param password The password.
   * @return The promise to update the account password.
   */
  updateAsync(accountId: number, password: string): Promise<boolean> {
    throw new Error('Not yet implemented');
  }

  /**
   * Promises a list of accounts.
   * @return The promise for the list of accounts.
   */
  viewAsync(): Promise<mio.IAccountLibraryItem[]> {
    throw new Error('Not yet implemented');
  }
}
