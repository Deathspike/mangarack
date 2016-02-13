import * as mio from '../module';

/**
 * Maps the collection to an array.
 * @param collection The collection.
 * @param mapper The mapper.
 * @return The mapped array.
 */
export function mapArray<TP, TR>(collection: {[key: string]: TP}, mapper: (value: TP, key: string) => TR): TR[] {
  let result: TR[] = [];
  for (let key in collection) {
    let value = collection[key];
    result.push(mapper(value, key));
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
export function mapArrayChild<TP, TC, TR>(
  collection: {[key: string]: TP},
  selector: (value: TP, key: string) => {[key: string]: TC},
  mapper: (value: TC, key: string, parentKey: string) => TR): TR[] {
  let result: TR[] = [];
  for (let parentKey in collection) {
    let childCollection = selector(collection[parentKey], parentKey);
    for (let childKey in childCollection) {
      let value = childCollection[childKey];
      result.push(mapper(value, childKey, parentKey));
    }
  }
  return result;
}

/**
 * Maps the collection to an object.
 * @param collection The collection.
 * @param keyMapper The key mapper.
 * @param valueMapper The value mapper.
 * @return The mapped object.
 */
export function mapObject<TP, TR>(collection: TP[], keyMapper: (item: TP) => string, valueMapper: (item: TP) => TR): {[key: string]: TR} {
  let result: {[key: string]: TR} = {};
  for (let item of collection) {
    result[keyMapper(item)] = valueMapper(item);
  }
  return result;
}

/**
 * Maps the child collection to an object.
 * @param collection The collection.
 * @param selector The selector.
 * @param keyMapper The key mapper.
 * @param valueMapper The value mapper.
 * @return The mapped object.
 */
/*export function mapChldObject<TP, TC, TR>(
  collection: TP[],
  selector: (value: TP) => TC[],
  keyMapper: (item: TC) => string,
  valueMapper: (item: TC) => TR): {[key: string]: TR} {
  let result: {[key: string]: TR} = {};
  for (let parentItem of collection) {
    let childCollection = selector(parentItem);
    for (let childItem of childCollection) {
      result[keyMapper(childItem)] = valueMapper(childItem);
    }
  }
  return result;
}*/
