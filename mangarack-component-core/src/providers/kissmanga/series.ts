declare let setTimeout: (callback: () => void, timeout: number) => void;
import * as mio from '../../default';
import {createChapter} from './chapter';
import {enhance} from '../enhance';
import {scan} from '../scan';
let httpService = mio.dependency.get<mio.IHttpService>('IHttpService');
let htmlService = mio.dependency.get<mio.IHtmlService>('IHtmlService');
let providerDomain = 'http://kissmanga.com';
let remapGenreType: mio.IDictionary = {'Sci-fi': 'Science Fiction'};

/**
 * Promises the series.
 * @internal
 * @param address The address.
 * @return The promise for the series.
 */
export async function createSeriesAsync(address: string): Promise<mio.ISeries> {
  let document = await downloadDocumentAsync(address);
  return createSeries(address, document);
}

/**
 * Creates the series.
 * @param address The address.
 * @param document The selector.
 * @return The series.
 */
function createSeries(address: string, document: mio.IHtmlDocument): mio.ISeries {
  return {
    artists: getArtists(document),
    authors: getAuthors(document),
    chapters: enhance(getChapters(document)),
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
async function downloadDocumentAsync(address: string): Promise<mio.IHtmlDocument> {
  try {
    let body = await httpService().text(address, {}, mio.RequestType.TimeoutWithRetry).getAsync();
    return htmlService().load(body);
  } catch (error) {
    if (error instanceof mio.HttpServiceError) {
      let httpServiceError = error as mio.HttpServiceError;
      if (httpServiceError.statusCode === 503) {
        let document = htmlService().load(httpServiceError.body);
        let pass = document('form[id=challenge-form]').find('input[name=pass]').attr('value');
        if (pass) {
          await mio.promise(callback => setTimeout(callback, 8000));
          await httpService().text(`${providerDomain}/cdn-cgi/l/chk_jschl?pass=${pass}`, {}, mio.RequestType.TimeoutWithRetry).getAsync();
          return downloadDocumentAsync(address);
        }
      }
    }
    throw error;
  }
}

/**
 * Promises the image.
 * @param $ The selector.
 * @return The promise for the image.
 */
function downloadImageAsync($: mio.IHtmlDocument): Promise<mio.IBlob> {
  let address = $('img[src*=\'/Uploads/\']').attr('src');
  if (address) {
    return httpService().blob(address, {}, mio.RequestType.TimeoutWithRetry).getAsync();
  } else {
    throw new Error('Invalid series cover address.');
  }
}

/**
 * Retrieves each artist.
 * @param $ The selector.
 * @return Each artist.
 */
function getArtists($: mio.IHtmlDocument): string[] {
  return [];
}

/**
 * Retrieves each author.
 * @param $ The selector.
 * @return Each author.
 */
function getAuthors($: mio.IHtmlDocument): string[] {
  return $('a[href*=\'/AuthorArtist/\']')
    .map((index, a) => $(a).text())
    .get();
}

/**
 * Retrieves each child.
 * @param $ The selector.
 * @return Each child.
 */
function getChapters($: mio.IHtmlDocument): mio.IChapter[] {
  let results: mio.IChapter[] = [];
  let title = getTitle($);
  $('a[href*=\'/Manga/\'][title*=\'Read\']').map((index, a) => {
    let address = $(a).attr('href');
    let isValid = /id=([0-9]+)$/i.test(address);
    if (address && isValid) {
      let metadata = scan($(a).text().replace(/([0-9])\.0+/, '$1.').substr(title.length));
      results.push(createChapter(`${providerDomain}/${address.replace(/^\//, '')}`, metadata));
    }
  });
  return results.reverse();
}

/**
 * Retrieves each genre.
 * @param $ The selector.
 * @return Each genre.
 */
function getGenres($: mio.IHtmlDocument): string[] {
  return $('a[href*=\'/Genre/\']')
    .map((index, a) => $(a).text())
    .get()
    .map(value => remapGenreType[value] || value);
}

/**
 * Retrieves the summary.
 * @param $ The selector.
 * @return The summary.
 */
function getSummary($: mio.IHtmlDocument): string {
  return $('span:contains(Summary:)').parent().next().text();
}

/**
 * Retrieves the title.
 * @param $ The selector.
 * @return The title.
 */
function getTitle($: mio.IHtmlDocument): string {
  let match = $('title').text().match(/^(.+)\s+Manga\s+\|/i);
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
function getType($: mio.IHtmlDocument): string {
  let genres = getGenres($);
  if (genres.indexOf('Manhua') !== -1) {
    return 'Manhua';
  } else if (genres.indexOf('Manhwa') !== -1) {
    return 'Manhwa';
  } else {
    return 'Manga';
  }
}
