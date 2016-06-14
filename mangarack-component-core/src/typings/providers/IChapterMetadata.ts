import * as mio from '../../default';

/**
 * Represents chapter metadata.
 */﻿
export interface IChapterMetadata {
  /**
   * Contains the number.
   */
  number: mio.IOption<number>;

  /**
   * Contains the title.
   */
  title: string;

  /**
   * Contains the version.
   */
  version: mio.IOption<number>;

  /**
   * Contains the volume.
   */
  volume: mio.IOption<number>;
  /**
   * Contains the scanning group.
   */
  group: mio.IOption<string>;
  /**
   * Contains the scanlation language.
   */
  language: mio.IOption<string>;
  /**
   * Contains the upload date.
   */
  uploadDate: mio.IOption<number>;
}
