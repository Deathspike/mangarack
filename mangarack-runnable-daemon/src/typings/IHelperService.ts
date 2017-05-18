import * as mio from '../default';

/**
 * Represents the helper service.
 */
export interface IHelperService {
  /**
   * Retrieves the content type for the image.
   * @param image The image.
   * @return The content type.
   */
  getContentType: (image: mio.IBlob) => string;

  /**
   * Parses the value to a boolean.
   * @param value The value.
   * @return The boolean.
   */
  parseBoolean: (value: any) => {hasValue: boolean, value: boolean};
}
