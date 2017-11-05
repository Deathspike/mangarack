import * as mio from '../../default';
import {createChapter} from './chapter';
import {enhance} from '../enhance';
import {site} from './site';
const httpService = mio.dependency.get<mio.IHttpService>('IHttpService');
const htmlService = mio.dependency.get<mio.IHtmlService>('IHtmlService');
const remapGenreType: mio.IDictionary = {'Sci-fi': 'Science Fiction', 'Webtoons': 'Webtoon'};

/**
 * Promises the series.
 * @param address The address.
 * @return The promise for the series.
 */
export async function createSeriesAsync(address: string): Promise<mio.ISeries> {
  let document = await downloadDocumentAsync(address);
  return createSeries(document, address);
}

/**
 * Creates the series.
 * @param document The selector.
 * @param address The address.
 * @return The series.
 */
function createSeries(document: mio.IHtmlServiceDocument, address: string): mio.ISeries {
  return {
    artists: getArtists(document),
    authors: getAuthors(document),
    chapters: enhance(getChapters(document, address)),
    genres: mio.toGenreType(getGenres(document)),
    imageAsync: () => downloadImageAsync(document),
    summary: getSummary(document),
    title: getTitle(document),
    type: mio.toSeriesType(getType(document), mio.SeriesType.Manga)
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
 * Promises the image.
 * @param $ The selector.
 * @return The promise for the image.
 */
function downloadImageAsync($: mio.IHtmlServiceDocument): Promise<mio.IBlob> {
  let address = $('img[src*=\'cover.jpg\']').attr('src');
  if (address) {
    return httpService().blob(address, mio.ControlType.TimeoutWithRetry).getAsync();
  } else {
    throw new Error('Invalid series cover address.');
  }
}

/**
 * Retrieves each artist.
 * @param $ The selector.
 * @return Each artist.
 */
function getArtists($: mio.IHtmlServiceDocument): string[] {
  return $('#title a[href*=\'/search/artist/\']')
    .map((_, a) => $(a).text())
    .get();
}

/**
 * Retrieves each author.
 * @param $ The selector.
 * @return Each author.
 */
function getAuthors($: mio.IHtmlServiceDocument): string[] {
  return $('#title a[href*=\'/search/author/\']')
    .map((_, a) => $(a).text())
    .get();
}

/**
 * Retrieves each child.
 * @param $ The selector.
 * @param address The address.
 * @return Each child.
 */
function getChapters($: mio.IHtmlServiceDocument, address: string): mio.IChapter[] {
  let results: mio.IChapter[] = [];
  $('h3.volume').each((_0, h3) => {
    let match = $(h3).text().trim().match(/^Volume\s(.+)$/i);
    if (match) {
      let volumeMatch = match[1];
      $(h3).parent().next().find('a[href*=\'/manga/\']').each((_1, a) => {
        let chapterAddress = $(a).attr('href');
        if (chapterAddress) {
          let numberMatch = $(a).text().match(/[0-9\.]+$/);
          let numberValue = numberMatch ? parseFloat(numberMatch[0]) : undefined;
          let title = $(a).next('span.title').text();
          results.push(createChapter(site.resolve(address, chapterAddress), {
            number: isFinite(numberValue) ? numberValue : undefined,
            title: /^Read Onl?ine$/i.test(title) ? '' : title,
            volume: parseFloat(volumeMatch)
          }));
        }
      });
    }
  });
  return results.reverse();
}

/**
 * Retrieves each genre.
 * @param $ The selector.
 * @return Each genre.
 */
function getGenres($: mio.IHtmlServiceDocument): string[] {
  return $('#title a[href*=\'/search/genres/\']')
    .map((_, a) => $(a).text())
    .get()
    .map(value => remapGenreType[value] || value);
}

/**
 * Retrieves the summary.
 * @param $ The selector.
 * @return The summary.
 */
function getSummary($: mio.IHtmlServiceDocument): string {
  return $('p.summary').text().split('\n')
    .map(piece => piece.trim().replace(/\s+/g, ' '))
    .filter(piece => piece.length > 0)
    .filter(piece => !/:$/i.test(piece))
    .filter(piece => !/^From\s+(.+)$/i.test(piece))
    .filter(piece => !/^\(Source:\s+(.+)\)/i.test(piece))
    .shift() || '';
}

/**
 * Retrieves the title.
 * @param $ The selector.
 * @return The title.
 */
function getTitle($: mio.IHtmlServiceDocument): string {
  let match = $('title').text().match(/^(.+)\s+Manga\s+-/i);
  if (match) {
    return match[1];
  } else {
    return '';
  }
}

/**
 * Retrieves the type.
 * @param $ The selector.
 * @return The type.
 */
function getType($: mio.IHtmlServiceDocument): string {
  let match = $('#title h1').text().match(/[\w]+$/);
  if (match) {
    return match[0];
  } else {
    return '';
  }
}
