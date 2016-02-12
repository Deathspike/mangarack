import * as mio from '../module';

/**
 * Maps the collection to an array.
 * @param collection The collection.
 * @param mapper The mapper.
 * @return The mapped array.
 */
export function map<TP, TR>(collection: {[key: string]: TP}, mapper: (value: TP, key: string) => TR): TR[] {
  let result: TR[] = [];
  for (let key in collection) {
    if (collection.hasOwnProperty(key)) {
      let value = collection[key];
      result.push(mapper(value, key));
    }
  }
  return result;
}

/**
 * Maps the child collection to an array.
 * @param collection The collection.
 * @param selector The selector.
 * @param mapper The mapper.
 * @return The mapped array.
 */
export function mapChild<TP, TC, TR>(
  collection: {[key: string]: TP},
  selector: (value: TP, key: string) => {[key: string]: TC},
  mapper: (value: TC, key: string, parentKey: string) => TR): TR[] {
  let result: TR[] = [];
  for (let parentKey in collection) {
    if (collection.hasOwnProperty(parentKey)) {
      let childCollection = selector(collection[parentKey], parentKey);
      for (let childKey in childCollection) {
        if (childCollection.hasOwnProperty(childKey)) {
          let value = childCollection[childKey];
          result.push(mapper(value, childKey, parentKey));
        }
      }
    }
  }
  return result;
}
