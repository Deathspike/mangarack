import * as mio from '../module';

/**
 * Finds the item in the collection.
 * @param collection The collection.
 * @param finder The finder.
 * @return The item in the collection.
 */
export function find<T>(collection: {[key: string]: T}, finder: (value: T, key: string) => boolean): mio.IOption<[string, T]> {
  for (let key in collection) {
    let value = collection[key];
    if (finder(value, key)) {
      return mio.option<[string, T]>([key, value]);
    }
  }
  return mio.option<[string, T]>();
}

/**
 * Finds the item in the child collection.
 * @param collection The collection.
 * @param selector The selector.
 * @param finder The finder.
 * @return The item in the child collection.
 */
export function findChild<TP, TC>(
  collection: {[key: string]: TP},
  selector: (value: TP, key: string) => {[key: string]: TC},
  finder: (value: TC, key: string) => boolean): mio.IOption<[string, string, TC]> {
  for (let key in collection) {
    let match = find(selector(collection[key], key), finder);
    if (match.value != null) {
      return mio.option<[string, string, TC]>([key, match.value[0], match.value[1]]);
    }
  }
  return mio.option<[string, string, TC]>();
}
