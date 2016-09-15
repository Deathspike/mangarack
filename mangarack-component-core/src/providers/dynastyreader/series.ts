import * as mio from '../../default';
import {createChapter} from './chapter';
import {enhance} from '../enhance';

const httpService = mio.dependency.get<mio.IHttpService>('IHttpService');
const htmlService = mio.dependency.get<mio.IHtmlService>('IHtmlService');
const providerDomain = 'http://dynasty-scans.com';
const remapGenreType: mio.IDictionary = {
  'Sci-fi': 'Science Fiction',
  'Adult': 'NSFW',
  'School life': 'SchoolLife'
};

/**
 * Promises the series.
 * @internal
 * @param address The address.
 * @return The promise for the series.
 */
export async function createSeriesAsync(address: string): Promise<mio.ISeries> {
  const document = await downloadDocumentAsync(address);
  return createSeries(document);
}

/**
 * Creates the series.
 * @param document The selector.
 * @return The series.
 */
function createSeries(document: mio.IHtmlDocument): mio.ISeries {
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
async function downloadDocumentAsync(address: string): Promise<mio.IHtmlDocument> {
  const body = await httpService().text(address, {}, mio.RequestType.TimeoutWithRetry).getAsync();
  return htmlService().load(body);
}

/**
 * Promises the image.
 * @param $ The selector.
 * @return The promise for the image.
 */
function downloadImageAsync($: mio.IHtmlDocument): Promise<mio.IBlob> {
  const address = $('.cover img').attr('src');

  if (address) {
    return httpService().blob(`${providerDomain}${address}`, {}, mio.RequestType.TimeoutWithRetry).getAsync();
  }

  throw new Error('Invalid series cover address.');
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
function getAuthors($: mio.IHtmlDocument): string[] {
  return $('.tag-title a[href*=\'/authors/\']')
    .map((index, a) => $(a).text())
    .get();
}

/**
 * Retrieves Metadata from URL
 * @param title The title.
 * @return Each child.
 */
function getMetadata(title: string): mio.IChapterMetadata {
  const numberMatch = title.match(/[-.0-9]+/);

  return {
    number: mio.option(numberMatch ? parseFloat(numberMatch[0]) : null),
    title: title,
    version: mio.option<number>(),
    volume: mio.option<number>()
  };
}

/**
 * Retrieves each child.
 * @param $ The selector.
 * @return Each child.
 */
function getChapters($: mio.IHtmlDocument): mio.IChapter[] {
  const results: mio.IChapter[] = [];

  $('.chapter-list a[href*=\'/chapters/\']').map((index, a) => {
    const address = $(a).attr('href');
    const isValid = /[0-9.]+$/i.test(address);

    if (address && isValid) {
      const metadata = getMetadata($(a).text());
      const url = `${providerDomain}${address}`;

      results.push(createChapter(url, metadata));
    }
  });

  return results;
}

/**
 * Retrieves each genre.
 * @param $ The selector.
 * @return Each genre.
 */
function getGenres($: mio.IHtmlDocument): string[] {
  return $('a.label')
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
  return $('.description').text();
}

/**
 * Retrieves the title.
 * @param $ The selector.
 * @return The title.
 */
function getTitle($: mio.IHtmlDocument): string {
  return $('.tag-title b').text();
}

/**
 * Retrieves the type.
 * @param $ The selector.
 * @return The type.
 */
function getType($: mio.IHtmlDocument): string {
  const genres = getGenres($);
  if (genres.indexOf('Art book') !== -1) {
    return 'Artbook';
  }

  if (genres.indexOf('Image Set') !== -1) {
    return 'Other';
  }

  return 'Manga';
}
