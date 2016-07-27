import * as fw from '../default';

/**
 * Represents a query.
 * @internal
 */
export class Query<T> implements fw.ILazyQuery<T> {
  private _filter: (item: T) => boolean;
  private _filterIndex: number;
  private _filterItems: T[];
  private _items: T[];
  private _nextItem: T|void;

  /**
   * Initializes a new instance of the LazyQuery class.
   * @param filter The filter.
   * @param items The items.
   */
  public constructor(filter: (item: T) => boolean, items: T[]) {
    this._filter = filter;
    this._filterIndex = 0;
    this._filterItems  = [];
    this._items = items;
  }

  /**
   * Retrieves an item.
   */
  public getItem(): T|void {
    if (this.hasItem() && !fw.isNull(this._nextItem)) {
      let currentItem = this._nextItem;
      this._filterItems.push(this._nextItem);
      this._nextItem = undefined;
      return currentItem;
    } else {
      return undefined;
    }
  }

  /**
   * Determines whether an item is available.
   * @return Indicates whether an item is available.
   */
  public hasItem(): boolean {
    if (fw.isNull(this._nextItem)) {
      while (this._filterIndex < this._items.length) {
        if (this._filter(this._items[this._filterIndex])) {
          this._nextItem = this._items[this._filterIndex];
          this._filterIndex++;
          break;
        } else {
          this._filterIndex++;
        }
      }
    }
    return !fw.isNull(this._nextItem);
  }
}
