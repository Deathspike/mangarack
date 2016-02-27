/**
 * Represents an action.
 */
export interface IAction<T> {
  /**
   * Contains the name.
   */
  name: string;

  /**
   * Contains the revision.
   */
  revision: T;
}
