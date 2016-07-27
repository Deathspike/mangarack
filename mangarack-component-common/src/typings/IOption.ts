/**
 * Represents an option value.
 */
export interface IOption<T> {
  /**
   * Indicates whether the option contains a value.
   */
  hasValue: boolean;

  /**
   * Contains the value.
   */
  value?: T;
}
