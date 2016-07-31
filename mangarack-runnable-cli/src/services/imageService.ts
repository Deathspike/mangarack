import * as gm from 'gm';
import * as mio from '../default';

/**
 * Represents the image service.
 */
export let imageService: mio.IImageService = {
  /**
   * Promises to process the image.
   * @param provider The provider.
   * @param image The image.
   * @return The promise to process the image.
   */
  processAsync: async function(provider: mio.IProvider, image: mio.IBlob): Promise<mio.IOption<mio.IBlob>> {
    let result = await coerceAsync(image);
    if (!result) {
      return result;
    } else {
      result = await normalizeAsync(image);
      if (!result) {
        return result;
      } else {
        return mangafoxHeuristicCropAsync(provider, result);
      }
    }
  }
};

/**
 * Promises to coerce the image.
 * @param image The image.
 * @return The promise to coerce the image.
 */
function coerceAsync(image: mio.IBlob): Promise<mio.IOption<mio.IBlob>> {
  switch (mio.helperService.getImageType(image)) {
    case mio.ImageType.Jpg:
      return Promise.resolve(image);
    case mio.ImageType.Gif:
      return mio.promise<mio.IBlob>(callback => gm(image as any).flatten().toBuffer('jpg', callback));
    case mio.ImageType.Png:
      return Promise.resolve(image);
    default:
      return mio.promise<mio.IBlob>(callback => gm(image as any).toBuffer('png', callback));
  }
}

/**
 * Promises to heuristically crop the mangafox-specific image.
 * @param provider The provider.
 * @param image The image.
 * @return The promise to heuristically crop the mangafox-specific image.
 */
export async function mangafoxHeuristicCropAsync(provider: mio.IProvider, image: mio.IBlob): Promise<mio.IOption<mio.IBlob>> {
  if (provider.name !== 'mangafox' || mio.settingService.getBoolean('runnable.cli.disableMangafoxHeuristicCrop')) {
    return image;
  } else {
    let size = await mio.promise<{width: number, height: number}>(callback => gm(image as any).size(callback));
    let rgb = await mio.promise<Buffer>(callback => gm(image as any).toBuffer('rgb', callback));
    if (!size || !rgb) {
      return image;
    } else {
      let cropLines = readNumberOfCropLines(rgb, size);
      if (cropLines === 0) {
        return image;
      } else {
        let narrowSize = size;
        return mio.promise<mio.IBlob>(callback => {
          gm(image as any).crop(narrowSize.width, narrowSize.height - cropLines).toBuffer(callback);
        });
      }
    }
  }
}

/**
 * Promises to normalize the image.
 * @param image The image.
 * @return The promise to normalize the image.
 */
export async function normalizeAsync(image: mio.IBlob): Promise<mio.IOption<mio.IBlob>> {
  if (mio.settingService.getBoolean('runnable.cli.disableNormalize')) {
    return image;
  } else {
    return mio.promise<mio.IBlob>(callback => gm(image as any).sharpen(5, 1.4).normalize().toBuffer(callback));
  }
}

/**
 * Reads the line for the average color when containing black.
 * @param buffer The buffer.
 * @param width The width.
 * @param y The position on the y-axis.
 */
function readLineAverageOrContainsBlack(buffer: Buffer, width: number, y: number): mio.IOption<{r: number, g: number, b: number}> {
  let totals = {b: 0, g: 0, r: 0};
  for (let x = 0, index = y * width * 3; x < width; x++, index += 3) {
    let r = buffer.readUInt8(index);
    let g = buffer.readUInt8(index + 1);
    let b = buffer.readUInt8(index + 2);
    if (r >= 45 && g >= 45 && b >= 45) {
      totals.r += r;
      totals.g += g;
      totals.b += b;
    } else {
      return undefined;
    }
  }
  return {b: Math.round(totals.b / width), g: Math.round(totals.g / width), r: Math.round(totals.r / width)};
}

/**
 * Reads the number of lines to crop.
 * @param buffer The buffer.
 * @param size The size.
 * @return The number of lines to crop.
 */
function readNumberOfCropLines(buffer: Buffer, size: {width: number, height: number}): number {
  let count = -1;
  let firstBlackY = -1;
  let lastBlackY = -1;
  for (let y = 0; y < 80 && y < size.height; y += 1) {
    let line = readLineAverageOrContainsBlack(buffer, size.width, size.height - y - 1);
    if (!line) {
      if (y !== 0) {
        firstBlackY = firstBlackY === -1 ? (firstBlackY > 5 ? 5 : y) : firstBlackY;
        lastBlackY = y;
      } else {
        return 0;
      }
    } else if (lastBlackY !== -1 && line.r >= 245 && line.g >= 245 && line.b >= 245) {
      count = firstBlackY + lastBlackY;
    }
  }
  return count;
}
