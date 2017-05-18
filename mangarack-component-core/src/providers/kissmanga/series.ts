import * as mio from '../../default';
import {createChapter} from './chapter';
import {enhance} from '../enhance';
import {scan} from '../scan';
const httpService = mio.dependency.get<mio.IHttpService>('IHttpService');
const htmlService = mio.dependency.get<mio.IHtmlService>('IHtmlService');
const providerDomain = 'http://kissmanga.com';
const remapGenreType: mio.IDictionary = {'Sci-fi': 'Science Fiction'};

/**
 * Promises the series.
 * @param address The address.
 * @return The promise for the series.
 */
export async function createSeriesAsync(address: string): Promise<mio.ISeries> {
  let document = await downloadDocumentAsync(address);
  return createSeries(document);
}

/**
 * Creates the series.
 * @param document The selector.
 * @return The series.
 */
function createSeries(document: mio.IHtmlServiceDocument): mio.ISeries {
  return {
    artists: getArtists(),
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
async function downloadDocumentAsync(address: string): Promise<mio.IHtmlServiceDocument> {
  try {
    let body = await httpService().text(address, mio.ControlType.Timeout).getAsync();
    return htmlService().load(body);
  } catch (error) {
    if (mio.HttpServiceError.isInstance(error) && error.statusCode === 503) {
      let document = htmlService().load(error.body);
      let documentForm = document('form[id=challenge-form]');
      let formJs = documentForm.find('input[name=jschl_vc]').attr('value');
      let formPass = documentForm.find('input[name=pass]').attr('value');
      if (formPass) {
        await mio.promise(callback => setTimeout(callback, 8500));
        await httpService().text(`${providerDomain}/cdn-cgi/l/chk_jschl?jschl_vc=${formJs}&pass=${formPass}`, mio.ControlType.Timeout).getAsync();
        return downloadDocumentAsync(address);
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
function downloadImageAsync($: mio.IHtmlServiceDocument): Promise<mio.IBlob> {
  let address = $('img[src*=\'/Uploads/\']').attr('src');
  if (address) {
    return httpService().blob(address, mio.ControlType.TimeoutWithRetry).getAsync();
  } else {
    throw new Error('Invalid series cover address.');
  }
}

/**
 * Retrieves each artist.
 * @return Each artist.
 */
function getArtists(): string[] {
  return [];
}

/**
 * Retrieves each author.
 * @param $ The selector.
 * @return Each author.
 */
function getAuthors($: mio.IHtmlServiceDocument): string[] {
  return $('a[href*=\'/AuthorArtist/\']')
    .map((_, a) => $(a).text())
    .get();
}

/**
 * Retrieves each child.
 * @param $ The selector.
 * @return Each child.
 */
function getChapters($: mio.IHtmlServiceDocument): mio.IChapter[] {
  let results: mio.IChapter[] = [];
  let title = getTitle($);
  $('a[href*=\'/Manga/\'][title*=\'Read\']').each((_, a) => {
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
function getGenres($: mio.IHtmlServiceDocument): string[] {
  return $('a[href*=\'/Genre/\']')
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
  return $('span:contains(Summary:)').parent().next().text();
}

/**
 * Retrieves the title.
 * @param $ The selector.
 * @return The title.
 */
function getTitle($: mio.IHtmlServiceDocument): string {
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
function getType($: mio.IHtmlServiceDocument): string {
  let genres = getGenres($);
  if (genres.indexOf('Manhua') !== -1) {
    return 'Manhua';
  } else if (genres.indexOf('Manhwa') !== -1) {
    return 'Manhwa';
  } else {
    return 'Manga';
  }
}
