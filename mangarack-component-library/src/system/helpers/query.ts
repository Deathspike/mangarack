'use strict';
import * as mio from '../module';

/**
 * Retrieves the amount of matches the selector yields.
 * @param items The items.
 * @param selector The selector.
 * @return The amount of matches the selector yields.
 */
export function queryCount<T>(items: {[key: string]: T}, selector: (item: T) => boolean): number {
  let result = 0;
  for (let key in items) {
    if (selector(items[key])) {
      result++;
    }
  }
  return result;
}

/**
 * Retrieves the maximum value the selector yields.
 * @param items The items.
 * @param selector The selector.
 * @return The maximum value the selector yields.
 */
export function queryMax<T>(items: {[key: string]: T}, selector: (item: T) => mio.IOption<number>): mio.IOption<number> {
  let best = mio.option<number>();
  for (let key in items) {
    let result = selector(items[key]);
    if (!best.hasValue || best.value < result.value) {
      best = result;
    }
  }
  return best;
}
