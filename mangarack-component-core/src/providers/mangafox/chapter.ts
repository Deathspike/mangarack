'use strict';
import * as mio from '../../default';
import {createPage} from './page';
let httpService = mio.dependency.get<mio.IHttpService>('IHttpService');
let htmlService = mio.dependency.get<mio.IHtmlService>('IHtmlService');

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
async function downloadDocumentAsync(address: string): Promise<mio.IHtmlDocument> {
  let body = await httpService().getStringAsync(address);
  return htmlService().load(body);
}

/**
 * Promises each page.
 * @param address The address.
 * @return The promise for each page.
 */
async function downloadPagesAsync(address: string): Promise<mio.IPage[]> {
  let document = await downloadDocumentAsync(address);
  return getPages(address, document);
}

/**
 * Retrieves each page.
 * @param address The address.
 * @param $ The selector.
 * @return Each page.
 */
function getPages(address: string, $: mio.IHtmlDocument): mio.IPage[] {
  let fullAddress = address + (/[0-9]+\.html$/i.test(address) ? '' : '1.html');
  return $('select.m').first().find('option:not(:last-child)').map((index, option) => createPage(
    fullAddress.replace(/[0-9]+\.html$/i, `${$(option).text()}.html`),
    {number: index + 1},
    mio.option(index ? null : $)
  )).get();
}
