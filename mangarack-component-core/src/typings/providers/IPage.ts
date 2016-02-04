import * as mio from '../../default';

/**
 * Represents a page.
 */
export interface IPage extends mio.IPageMetadata {
  /**
   * Promises the image.
   * @return The promise for the image.
   */
  imageAsync: () => Promise<mio.IBlob>;
}
