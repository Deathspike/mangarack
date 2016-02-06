/**
 * Represents the user view.
 */
export interface IUserView {
  /**
   * Contains each user.
   */
  users: {[name: string]: {
    /**
     * Contains the identifier.
     */
    id: number;
  }};
}
