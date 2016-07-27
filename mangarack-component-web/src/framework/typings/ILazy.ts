import * as fw from '../default';

/**
 * Represents a collection of lazy utilities.
 */
export interface ILazy {
  /**
   * Maps the items to a lazy map.
   * @param items The items.
   * @param map The map.
   * @param options The options.
   * @return The lazy map.
   */
  map: <T>(items: T[], map: (item: T) => any, options?: {x?: number, y: number}) => JSX.Element;

  /**
   * Maps the items to a lazy map.
   * @param filter The filter.
   * @param items The items.
   * @param map The map.
   * @param options The options.
   * @return The lazy map.
   */
  mapFilter: <T>(filter: (item: T) => boolean, items: T[], map: (item: T) => any, options?: {x?: number, y: number}) => JSX.Element;

  /**
   * Maps the items to a lazy map.
   * @param query The query.
   * @param map The map.
   * @param options The options.
   * @return The lazy map.
   */
  mapQuery: <T>(query: fw.ILazyQuery<T>, map: (item: T) => any, options?: {x?: number, y: number}) => JSX.Element;

  /**
   * Creates a lazy query.
   * @param filter The filter.
   * @param items The items.
   * @return The lazy query.
   */
  query: <T>(filter: (item: T) => boolean, items: T[]) => fw.ILazyQuery<T>;
}
