import * as mio from '../module';

/**
 * Represents an user section.
 */
export class UserSection implements mio.IUserLibrary {
  private _context: mio.IContext;

  /**
   * Initializes a new instance of the UserSection class.
   * @param context The context.
   */
  constructor(context: mio.IContext) {
    this._context = context;
  }

  /**
   * Promises to create an user.
   * @param userName The user name.
   * @param password The password.
   * @return The promise to create an user.
   */
  async createAsync(userName: string, password: string): Promise<mio.IOption<number>> {
    if (this._context.users[userName]) {
      return mio.option<number>();
    } else {
      let user = {id: ++this._context.lastId, password: password};
      this._context.users[userName] = user;
      await mio.contextService.writeContext();
      return mio.option(user.id);
    }
  }

  /**
   * Promises to delete the chapter.
   * @param chapterId The chapter identifier.
   * @return The promise to delete the chapter.
   */
  async deleteAsync(userId: number): Promise<boolean> {
    let match = mio.find(this._context.users, user => user.id === userId);
    if (match.value != null) {
      /* TODO: Delete all user series, too, to clean up the entire tree of contexts. */
      delete this._context.users[match.value[0]];
      await mio.contextService.writeContext();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Determines whether the user name and password combination is valid.
   * @param userName The user name.
   * @param password The password.
   * @return Indicates whether the user name and password combination is valid.
   */
  isValid(userName: string, password: string): boolean {
    let match = mio.find(this._context.users, (user, key) => key === userName && user.password === password);
    return match.value != null;
  }

  /**
   * Promises a series library for the user.
   * @param userId The user identifier.
   * @return The promise for the series library for the user.
   */
  async seriesAsync(userId: number): Promise<mio.IOption<mio.ISeriesLibrary>> {
    let match = mio.find(this._context.users, user => user.id === userId);
    if (match.value != null) {
      return mio.option(new mio.SeriesSection(this._context, userId));
    } else {
      return mio.option<mio.ISeriesLibrary>();
    }
  }

  /**
   * Promises to update the user password.
   * @param userId The user identifier.
   * @param password The password.
   * @return The promise to update the user password.
   */
  async updateAsync(userId: number, password: string): Promise<boolean> {
    let match = mio.find(this._context.users, user => user.id === userId);
    if (match.value != null) {
      match.value[1].password = password;
      await mio.contextService.writeContext();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Promises a list of users.
   * @return The promise for the list of users.
   */
  viewAsync(): Promise<mio.IUserLibraryItem[]> {
    return Promise.resolve(mio.map(this._context.users, (user, userName) => ({
      userName: userName,
      id: user.id
    })));
  }
}
