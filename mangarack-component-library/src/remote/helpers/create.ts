import * as mio from '../module';

/**
 * Creates the handler for the asynchronous function.
 * @param runAsync The asynchronous function.
 * @return The handler for the asynchronous function.
 */
export function createHandler<T extends Function>(runAsync: T): mio.ILibraryHandler<T> {
  return {runAsync: runAsync};
}
