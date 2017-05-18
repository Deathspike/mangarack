import * as mio from '../../default';
import {createPage} from './page';
import {site} from './site';
const httpService = mio.dependency.get<mio.IHttpService>('IHttpService');
const htmlService = mio.dependency.get<mio.IHtmlService>('IHtmlService');

/**
 * Creates the chapter.
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
async function downloadDocumentAsync(address: string): Promise<mio.IHtmlServiceDocument> {
  let body = await httpService().text(address, mio.ControlType.TimeoutWithRetry).getAsync();
  return htmlService().load(body);
}

/**
 * Promises each page.
 * @param address The address.
 * @return The promise for each page.
 */
async function downloadPagesAsync(address: string): Promise<mio.IPage[]> {
  let document = await downloadDocumentAsync(address);
  return getPages(document);
}

/**
 * Retrieves each page.
 * @param $ The selector.
 * @return Each page.
 */
function getPages($: mio.IHtmlServiceDocument): mio.IPage[] {
  let i = 0;
  let match: mio.IOption<RegExpExecArray>;
  let regexp = /lstImages\.push\(wrapKA\("(.+?)"\)\)/gi;
  let results: mio.IPage[] = [];
  let text = $('script:contains(lstImages)').text();
  while (true) {
    match = regexp.exec(text) || undefined;
    if (match) {
      results.push(createPage(site.decodeImageUrl(match[1]), {number: i + 1}));
      i += 1;
    } else {
      break;
    }
  }
  return results;
}
