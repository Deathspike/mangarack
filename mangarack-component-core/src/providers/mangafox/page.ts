'use strict';
import * as mio from '../../default';
let httpService = mio.dependency.get<mio.IHttpService>('IHttpService');
let htmlService = mio.dependency.get<mio.IHtmlService>('IHtmlService');

/**
 * Creates the page.
 * @param address The address.
 * @param metadata The metadata.
 * @param previousDocument= The previous document.
 * @return The page.
 */
export function createPage(address: string, metadata: mio.IPageMetadata, previousDocument?: mio.IOption<mio.IHtmlDocument>): mio.IPage {
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
async function downloadDocumentAndImageAsync(address: string, previousDocument?: mio.IOption<mio.IHtmlDocument>): Promise<mio.IBlob> {
  let document = await downloadDocumentAsync(address, previousDocument);
  return downloadImageAsync(document);
}

/**
 * Promises the document.
 * @param address The address.
 * @param previousDocument= The previous document.
 * @return The promise for the document.
 */
async function downloadDocumentAsync(address: string, previousDocument?: mio.IOption<mio.IHtmlDocument>): Promise<mio.IHtmlDocument> {
  if (previousDocument == null || previousDocument.value == null) {
    let body = await httpService().getStringAsync(address);
    return htmlService().load(body);
  } else {
    return previousDocument.value;
  }
}

/**
 * Promises the image.
 * @param $ The selector.
 * @return The promise for the image.
 */
function downloadImageAsync($: mio.IHtmlDocument): Promise<mio.IBlob> {
  let viewer = $('#viewer img:not(.loadingImg)');
  let address = viewer.attr('src');
  if (address) {
    let alternativeAddress = viewer.attr('onerror').match(/^this.src='(.*)'$/);
    if (alternativeAddress && address !== alternativeAddress[1]) {
      return httpService().getBlobAsync([address, alternativeAddress[1]]);
    } else {
      throw new Error('Invalid alternative page address.');
    }
  } else {
    throw new Error('Invalid page address.');
  }
}
