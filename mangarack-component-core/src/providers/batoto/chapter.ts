import * as mio from '../../default';
import {createPage} from './page';
import {site} from './site';
const httpService = mio.dependency.get<mio.IHttpService>('IHttpService');
const htmlService = mio.dependency.get<mio.IHtmlService>('IHtmlService');

/**
 * Creates the chapter.
 * @param externalAddress The external address.
 * @param metadata The metadata.
 * @return The chapter.
 */
export function createChapter(externalAddress: string, metadata: mio.IChapterMetadata): mio.IChapter {
  return {
    number: metadata.number,
    pagesAsync: () => downloadPagesAsync(externalAddress),
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
async function downloadDocumentAsync(address: string): Promise<mio.IHtmlServiceDocument> {
  let body = await httpService().text(`${address}&p=1&supress_webtoon=t`, mio.ControlType.TimeoutWithRetry, site.readerHeaders).getAsync();
  return htmlService().load(body);
}

/**
 * Promises each page.
 * @param externalAddress The external address.
 * @return The promise for each page.
 */
async function downloadPagesAsync(externalAddress: string): Promise<mio.IPage[]> {
  let match = externalAddress.match(/#(.*)$/);
  if (match) {
    let address = `http://bato.to/areader?id=${match[1]}`;
    let document = await downloadDocumentAsync(address);
    return getPages(address, document);
  } else {
    throw new Error(`Invalid external address: ${externalAddress}`);
  }
}

/**
 * Retrieves each page.
 * @param address The address.
 * @param $ The selector.
 * @return Each page.
 */
function getPages(address: string, $: mio.IHtmlServiceDocument): mio.IPage[] {
  let select = $('select[name=page_select]').first();
  return select.find('option').map(index => createPage(
    `${address}&p=${index + 1}`,
    {number: index + 1},
    index ? undefined : $
  )).get();
}
