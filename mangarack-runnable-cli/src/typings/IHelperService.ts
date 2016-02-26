import * as mio from '../default';

/**
 * Represents the helper service.
 */
export interface IHelperService {
  /**
   * Gets the image extension.
   * @param image The image.
   * @return The extension.
   */
  getImageExtension: (image: mio.IBlob) => string;

  /**
   * Gets the image type.
   * @param image The image.
   * @return The image type.
   */
  getImageType: (image: mio.IBlob) => mio.ImageType;
}
