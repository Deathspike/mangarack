/**
 * Represents the order type.
 */
export enum OrderType {
  /**
   * Represents an ordering by date a chapter was added.
   */
  ChapterAdded,

  /**
   * Represents an ordering by date a chapter was read.
   */
  ChapterRead,

  /**
   * Represents an ordering by date the was series added.
   */
  SeriesAdded,

  /**
   * Represents an ordering by series title.
   */
  SeriesTitle
}
