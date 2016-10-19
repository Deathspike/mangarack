/**
 * Represents a library handler.
 */
export interface ILibraryHandler<T extends Function> {
  /**
   * Runs the handler.
   */
  runAsync: T;
}
