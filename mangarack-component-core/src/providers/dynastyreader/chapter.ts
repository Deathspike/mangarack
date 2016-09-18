import * as mio from '../../default';
import {createPage} from './page';
const httpService = mio.dependency.get<mio.IHttpService>('IHttpService');
const htmlService = mio.dependency.get<mio.IHtmlService>('IHtmlService');

/**
 * Creates the chapter.
 * @internal
 * @param address The address.
 * @param metadata The metadata.
 * @return The chapter.
 */
export function createChapter(address: string, metadata: mio.IChapterMetadata): mio.IChapter {
  return {
    number: metadata.number,
    pagesAsync: () => downloadPagesAsync(address),
    title: metadata.title,
    version: metadata.version,
    volume: metadata.volume
  };
}

/**
 * Promises the document.
 * @param address The address.
 * @return The promise for the document.
 */
async function downloadDocumentAsync(address: string): Promise<mio.IHtmlDocument> {
  const body = await httpService().text(address, {}, mio.RequestType.TimeoutWithRetry).getAsync();
  return htmlService().load(body);
}

/**
 * Promises each page.
 * @param address The address.
 * @return The promise for each page.
 */
async function downloadPagesAsync(address: string): Promise<mio.IPage[]> {
  const document = await downloadDocumentAsync(address);
  return getPages(document);
}

/**
 * Retrieves each page.
 * @param $ The selector.
 * @return Each page.
 */
function getPages($: mio.IHtmlDocument): mio.IPage[] {
  const script = $('.container ~ script');
  const pagesMatch = script.html().match(/\{.*?}/g);
  const address = 'http://dynasty-scans.com/';
  return pagesMatch.map((pageString, index) => {
    const page: {image: string} = JSON.parse(pageString);
    return createPage(`${address}${page.image}`, {number: index + 1});
  });
}
