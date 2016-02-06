/**
 * Represents the user archive.
 */
export interface IUserArchive {
  /**
   * Contains the next identifier.
   */
  nextId: number;

  /**
   * Contains each user.
   */
  users: {[name: string]: {
    /**
     * Contains the identifier.
     */
    id: number;

    /**
     * Contains the password.
     */
    password: string;
  }};
}
