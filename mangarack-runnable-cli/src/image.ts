'use strict';
import * as gm from 'gm';
import * as mio from './default';
let storeService = mio.dependency.get<mio.IStoreService>('IStoreService');

/**
 * Represents image functionality.
 */
export let image = {
  /**
   * Promises to process the image.
   * @param provider The provider.
   * @param image The image.
   * @return The promise to process the image.
   */
  processAsync: async function(provider: mio.IProvider, image: mio.IBlob): Promise<mio.IOption<mio.IBlob>> {
    let result = await coerceAsync(image);
    if (result.value == null) {
      return result;
    } else {
      result = await normalizeAsync(image);
      if (result.value == null) {
        return result;
      } else {
        return mangafoxHeuristicCropAsync(provider, result.value);
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
  switch (mio.helper.getImageType(image)) {
    case mio.ImageType.Jpg:
      return Promise.resolve(mio.option(image));
    case mio.ImageType.Gif:
      return mio.helper.promisify<mio.IBlob>(cb => gm(image as any).flatten().toBuffer('jpg', cb));
    case mio.ImageType.Png:
      return Promise.resolve(mio.option(image));
    default:
      return mio.helper.promisify<mio.IBlob>(cb => gm(image as any).toBuffer('png', cb));
  }
}

/**
 * Promises to heuristically crop the mangafox-specific image.
 * @param provider The provider.
 * @param image The image.
 * @return The promise to heuristically crop the mangafox-specific image.
 */
export async function mangafoxHeuristicCropAsync(provider: mio.IProvider, image: mio.IBlob): Promise<mio.IOption<mio.IBlob>> {
  if (provider.name !== 'mangafox' || storeService().getBoolean('runnable.cli.disableMangafoxHeuristicCrop')) {
    return mio.option(image);
  } else {
    let size = await mio.helper.promisify<{width: number, height: number}>(cb => gm(image as any).size(cb));
    let rgb = await mio.helper.promisify<Buffer>(cb => gm(image as any).toBuffer('rgb', cb));
    if (size.value == null || rgb.value == null) {
      return mio.option(image);
    } else {
      let cropLines = readNumberOfCropLines(rgb.value, size.value);
      if (cropLines === 0) {
        return mio.option(image);
      } else {
        return mio.helper.promisify<mio.IBlob>(cb => gm(image as any).crop(size.value.width, size.value.height - cropLines).toBuffer(cb));
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
  if (storeService().getBoolean('runnable.cli.disableNormalize')) {
    return mio.option(image);
  } else {
    return mio.helper.promisify<mio.IBlob>(cb => gm(image as any).sharpen(5, 1.4).normalize().toBuffer(cb));
  }
}

/**
 * Reads the line for the average color, or null when containing black.
 * @param buffer The buffer.
 * @param width The width.
 * @param y The position on the y-axis.
 */
function readLineAverageOrContainsBlack(buffer: Buffer, width: number, y: number): mio.IOption<{r: number, g: number, b: number}> {
  let totals = {r: 0, g: 0, b: 0};
  for (let x = 0, index = y * width * 3; x < width; x++, index += 3) {
    let r = buffer.readUInt8(index);
    let g = buffer.readUInt8(index + 1);
    let b = buffer.readUInt8(index + 2);
    if (r >= 45 && g >= 45 && b >= 45) {
      totals.r += r;
      totals.g += g;
      totals.b += b;
    } else {
      return mio.option<{r: number, b: number, g: number}>();
    }
  }
  return mio.option({r: Math.round(totals.r / width), g: Math.round(totals.g / width), b: Math.round(totals.b / width)});
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
    if (line.value == null) {
      if (y !== 0) {
        firstBlackY = firstBlackY === -1 ? (firstBlackY > 5 ? 5 : y) : firstBlackY;
        lastBlackY = y;
      } else {
        return 0;
      }
    } else if (lastBlackY !== -1 && line.value.r >= 245 && line.value.g >= 245 && line.value.b >= 245) {
      count = firstBlackY + lastBlackY;
    }
  }
  return count;
}
