/**
 * Represents the order type.
 */
export enum OrderType {
  /**
   * Represents an ordering by date a chapter was added.
   */
  DateChapterAdded,

  /**
   * Represents an ordering by date a chapter was read.
   */
  DateChapterRead,

  /**
   * Represents an ordering by date the was series added.
   */
  DateSeriesAdded,

  /**
   * Represents an ordering by series title.
   */
  SeriesTitle
}
