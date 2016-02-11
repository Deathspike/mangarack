/**
 * Represents an account library context.
 */
export interface IAccountLibraryContext {
  /**
   * Contains each account.
   */
  accounts: {[accountName: string]: {
    /**
     * Contains the identifier.
     */
    id: number;

    /**
     * Contains the password.
     */
    password: string;
  }};

  /**
   * Contains the next identifier.
   */
  nextId: number;
}
