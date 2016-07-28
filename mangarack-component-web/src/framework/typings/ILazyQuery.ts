/**
﻿ * Represents a lazy query.
﻿ */
export interface ILazyQuery<T> {
  /**
   * Retrieves an item.
   */
  getItem(): T | undefined;

  /**
   * Determines whether an item is available.
   * @return Indicates whether an item is available.
   */
  hasItem(): boolean;
}
