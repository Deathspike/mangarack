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
      await this._saveAsync();
      return mio.option(account.id);
    }
  }

  /**
   * Promises to delete the chapter.
   * @param chapterId The chapter identifier.
   * @return The promise to delete the chapter.
   */
  async deleteAsync(accountId: number): Promise<boolean> {
    for (let [accountName, account] of mio.entries(this._context.accounts)) {
      if (account.id === accountId) {
        /*TODO: Delete all user series, too, to clean up the entire tree of contexts.*/
        delete this._context.accounts[accountName];
        await this._saveAsync();
        return true;
      }
    }
    return false;
  }

  /**
   * Determines whether the account name and password combination is valid.
   * @param accountName The account name.
   * @param password The password.
   * @return Indicates whether the account name and password combination is valid.
   */
  isValid(accountName: string, password: string): boolean {
    return mio.entries(this._context.accounts).some(entry => entry[0] === accountName && entry[1].password === password);
  }

  /**
   * Promises a series library for the account.
   * @param accountId The account identifier.
   * @return The promise for the series library for the account.
   */
  async seriesAsync(accountId: number): Promise<mio.IOption<mio.ISeriesLibrary>> {
    for (let [accountName, account] of mio.entries(this._context.accounts)) {
      if (account.id === accountId) {
        let context = await mio.sectionService.getSeriesContextAsync();
        return mio.option(new mio.SeriesSection(context, accountId));
      }
    }
    return mio.option<mio.ISeriesLibrary>();
  }

  /**
   * Promises to update the account password.
   * @param accountId The account identifier.
   * @param password The password.
   * @return The promise to update the account password.
   */
  async updateAsync(accountId: number, password: string): Promise<boolean> {
    for (let [accountName, account] of mio.entries(this._context.accounts)) {
      if (account.id === accountId) {
        account.password = password;
        await this._saveAsync();
        return true;
      }
    }
    return false;
  }

  /**
   * Promises a list of accounts.
   * @return The promise for the list of accounts.
   */
  viewAsync(): Promise<mio.IAccountLibraryItem[]> {
    let result: mio.IAccountLibraryItem[] = [];
    for (let [accountName, account] of mio.entries(this._context.accounts)) {
      result.push({
        accountName: accountName,
        id: account.id
      });
    }
    return Promise.resolve(result);
  }

  /**
   * Promises to save the context.
   * @return The promise to save the context.
   */
  private _saveAsync(): Promise<void> {
    return mio.sectionService.writeAccountContextAsync(this._context);
  }
}
