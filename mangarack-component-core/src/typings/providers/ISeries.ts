import * as mio from '../../default';

/**
 * Represents a series.
 */﻿
export interface ISeries extends mio.ISeriesMetadata {
  /**
   * Contains each chapter.
   */
  chapters: mio.IChapter[];

  /**
   * Promises the image.
   * @return The promise for the image.
   */
  imageAsync: () => Promise<mio.IBlob>;
}
