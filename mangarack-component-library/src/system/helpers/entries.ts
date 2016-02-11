/**
 * Retrieves an array of key/value tuples.
 * @param items The items.
 * @return The array of key/value tuples.
 */
export function entries<T>(items: {[key: string]: T}): [string, T][] {
  let result: [string, T][] = [];
  for (let key of Object.keys(items)) {
    result.push([key, items[key]]);
  }
  return result;
}
