import * as mio from '../../default';
let httpService = mio.dependency.get<mio.IHttpService>('IHttpService');

/**
 * Creates the page.
 * @internal
 * @param address The address.
 * @param metadata The metadata.
 * @return The page.
 */
export function createPage(address: string, metadata: mio.IPageMetadata): mio.IPage {
  return {
    imageAsync: () => downloadImageAsync(address),
    number: metadata.number
  };
}

/**
 * Promises the image.
 * @param address The address.
 * @return The promise for the image.
 */
function downloadImageAsync(address: string): Promise<mio.IBlob> {
  return httpService().blob(address, {}, mio.RequestType.TimeoutWithRetry).getAsync();
}
