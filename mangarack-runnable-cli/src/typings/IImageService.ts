import * as mio from '../default';

/**
 * Represents the image service.
 */
export interface IImageService {
  /**
   * Promises to process the image.
   * @param provider The provider.
   * @param image The image.
   * @return The promise to process the image.
   */
  processAsync: (provider: mio.IProvider, image: mio.IBlob) => Promise<mio.IOption<mio.IBlob>>;
}
