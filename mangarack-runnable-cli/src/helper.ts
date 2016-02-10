'use strict';
import * as mio from './default';

/**
 * Represents the helper.
 */
export let helper = {
  /**
   * Gets the image extension.
   * @param image The image.
   * @return The extension.
   */
  getImageExtension: function(image: mio.IBlob): string {
    let imageType = helper.getImageType(image);
    return imageType === mio.ImageType.Unknown ? '' : mio.ImageType[imageType].toLowerCase();
  },

  /**
   * Gets the image type.
   * @param image The image.
   * @return The image type.
   */
  getImageType: function(image: mio.IBlob): mio.ImageType {
    let buffer = image as Buffer;
    if (buffer.slice(0, 3).toString('hex') === '474946') {
      return mio.ImageType.Gif;
    } else if (buffer.slice(0, 2).toString('hex') === 'ffd8') {
      return mio.ImageType.Jpg;
    } else if (buffer.slice(0, 4).toString('hex') === '89504e47') {
      return mio.ImageType.Png;
    } else {
      return mio.ImageType.Unknown;
    }
  },

  /**
   * Creates a promise and invokes the runner with a callback handler to resolves the promise.
   * @param runner The runner.
   * @return The promise.
   */
  promisify: function<T>(runner: (cb: (err?: any, value?: T) => void) => void): Promise<mio.IOption<T>> {
    return new Promise<mio.IOption<T>>((resolve, reject) => {
      runner((err: any, value: T) => {
        if (err) {
          reject(err);
        } else {
          resolve(mio.option(value));
        }
      });
    });
  }
};
