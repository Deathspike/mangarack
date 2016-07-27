import * as fw from './default';
import * as fwInternals from './internals';

/**
 * Represents a collection of lazy utilities.
 */
export let lazy: fw.ILazy = {
  /**
   * Maps the items to a lazy map.
   * @param items The items.
   * @param map The map.
   * @param options The options.
   * @return The lazy map.
   */
  map: function<T>(items: T[], map: (item: T) => any, options?: {x?: number, y: number}): JSX.Element {
    return lazy.mapFilter(() => true, items, map, options);
  },

  /**
   * Maps the items to a lazy map.
   * @param filter The filter.
   * @param items The items.
   * @param map The map.
   * @param options The options.
   * @return The lazy map.
   */
  mapFilter: function<T>(filter: (item: T) => boolean, items: T[], map: (item: T) => any, options?: {x?: number, y: number}): JSX.Element {
    return lazy.mapQuery(lazy.query(filter, items), map, options);
  },

  /**
   * Maps the items to a lazy map.
   * @param query The query.
   * @param map The map.
   * @param options The options.
   * @return The lazy map.
   */
  mapQuery: function<T>(query: fw.ILazyQuery<T>, map: (item: T) => any, options?: {x?: number, y: number}): JSX.Element {
    let x = options ? options.x : undefined;
    let y = options ? options.y : undefined;
    return <fw.LazyMapComponent query={query} map={map} x={x} y={y} />;
  },

  /**
   * Creates a lazy query.
   * @param filter The filter.
   * @param items The items.
   * @return The lazy query.
   */
  query: function<T>(filter: (item: T) => boolean, items: T[]): fw.ILazyQuery<T> {
    return new fwInternals.Query(filter, items);
  }
};
