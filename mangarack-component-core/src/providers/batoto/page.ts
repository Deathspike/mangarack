import * as mio from '../../default';
import {site} from './site';
let httpService = mio.dependency.get<mio.IHttpService>('IHttpService');
let htmlService = mio.dependency.get<mio.IHtmlService>('IHtmlService');

/**
 * Creates the page.
 * @internal
 * @param address The address.
 * @param metadata The metadata.
 * @param previousDocument= The previous document.
 * @return The page.
 */
export function createPage(address: string, metadata: mio.IPageMetadata, previousDocument?: mio.IHtmlDocument): mio.IPage {
  return {
    imageAsync: () => downloadDocumentAndImageAsync(address, previousDocument),
    number: metadata.number
  };
}

/**
 * Promises the image.
 * @param address The address.
 * @param previousDocument= The previous document.
 * @return The promise for the image.
 */
async function downloadDocumentAndImageAsync(address: string, previousDocument?: mio.IHtmlDocument): Promise<mio.IBlob> {
  let document = await downloadDocumentAsync(address, previousDocument);
  return downloadImageAsync(document);
}

/**
 * Promises the document.
 * @param address The address.
 * @param previousDocument= The previous document.
 * @return The promise for the document.
 */
async function downloadDocumentAsync(address: string, previousDocument?: mio.IHtmlDocument): Promise<mio.IHtmlDocument> {
  if (previousDocument) {
    return previousDocument;
  } else {
    let body = await httpService().text(address, site.readerHeaders, mio.RequestType.TimeoutWithRetry).getAsync();
    return htmlService().load(body);
  }
}

/**
 * Promises the image.
 * @param $ The selector.
 * @return The promise for the image.
 */
function downloadImageAsync($: mio.IHtmlDocument): Promise<mio.IBlob> {
  let address = $('img[alt*=\'Batoto!\']').attr('src');
  if (address) {
    return httpService().blob(address, {}, mio.RequestType.TimeoutWithRetry).getAsync();
  } else {
    throw new Error('Invalid page address.');
  }
}
