import * as mio from '../../default';

/**
 * Represents series metadata.
 */
export interface ISeriesMetadata {
  /**
   * Contains each artist.
   */
  artists: string[];

  /**
   * Contains each author.
   */
  authors: string[];

  /**
   * Contains each genre.
   */
  genres: mio.GenreType[];

  /**
   * Contains the summary.
   */
  summary: string;

  /**
   * Contains the title.
   */
  title: string;

  /**
   * Contains the type.
   */
  type: mio.SeriesType;
}
