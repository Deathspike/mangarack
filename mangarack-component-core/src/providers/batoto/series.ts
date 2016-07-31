import * as mio from '../../default';
import {createChapter} from './chapter';
import {enhance} from '../enhance';
import {scan} from '../scan';
let httpService = mio.dependency.get<mio.IHttpService>('IHttpService');
let htmlService = mio.dependency.get<mio.IHtmlService>('IHtmlService');
let remapGenreType: mio.IDictionary = {'Oneshot': 'One Shot', 'Sci-fi': 'Science Fiction'};

/**
 * Promises the series.
 * @internal
 * @param address The address.
 * @return The promise for the series.
 */
export async function createSeriesAsync(address: string): Promise<mio.ISeries> {
  let document = await downloadDocumentAsync(address, false);
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
 * @param hasAttemptedLogin Indicates whether logging has been attempted.
 * @return The promise for the document.
 */
async function downloadDocumentAsync(address: string, hasAttemptedLogin: boolean): Promise<mio.IHtmlDocument> {
  let body = await httpService().text(address, {}, mio.RequestType.TimeoutWithRetry).getAsync();
  let document = htmlService().load(body);
  let isLogged = Boolean(document('#user_navigation.logged_in').first().text());
  if (!isLogged) {
    let username = mio.settingService.getString('component.core.batoto.username');
    let password = mio.settingService.getString('component.core.batoto.password');
    if (!hasAttemptedLogin && username && password) {
      let loginAddress = 'https://bato.to/forums/index.php?app=core&module=global&section=login&do=process';
      await httpService().text(loginAddress, {origin: 'https://bato.to'}, mio.RequestType.TimeoutWithRetry).postAsync({
        auth_key: document('input[name=auth_key]').attr('value'),
        ips_password: password,
        ips_username: username,
        referer: document('input[name=referer]').attr('value'),
        rememberMe: '1'
      });
      await mio.promise(callback => setTimeout(callback, 1000));
      return downloadDocumentAsync(address, true);
    } else {
      throw new Error(`Invalid 'component.core.batoto.username' or 'component.core.batoto.password'.`);
    }
  } else {
    return document;
  }
}

/**
 * Promises the image.
 * @param $ The selector.
 * @return The promise for the image.
 */
function downloadImageAsync($: mio.IHtmlDocument): Promise<mio.IBlob> {
  let address = $('img[src*=\'/uploads/\']').first().attr('src');
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
  return $('td:contains(Artist:)').next().find('a')
    .map((index, a) => $(a).text())
    .get();
}

/**
 * Retrieves each author.
 * @param $ The selector.
 * @return Each author.
 */
function getAuthors($: mio.IHtmlDocument): string[] {
  return $('td:contains(Author:)').next().find('a')
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
  $('tr.lang_English').find('a[href*=\'/reader\']').map((index, a) => {
    let address = $(a).attr('href');
    if (address) {
      let metadata = scan($(a).text());
      results.push(createChapter(address, metadata));
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
  let isMature = Boolean($('.ipsBox .clear').first().next().text());
  let initialArray = (isMature ? ['Mature'] : []);
  return initialArray.concat($('td:contains(Genres:)').next().find('a')
    .map((index, a) => $(a).text())
    .get()
    .map(value => remapGenreType[value] || value));
}

/**
 * Retrieves the summary.
 * @param $ The selector.
 * @return The summary.
 */
function getSummary($: mio.IHtmlDocument): string {
  let html = $('td:contains(Description:)').next().html();
  let text = $('<div />').html(html.replace(/<br\s*\/?>/g, '\n')).text();
  return text;
}

/**
 * Retrieves the title.
 * @param $ The selector.
 * @return The title.
 */
function getTitle($: mio.IHtmlDocument): string {
  return $('h1.ipsType_pagetitle').text();
}

/**
 * Retrieves the type.
 * @param $ The selector.
 * @return The type.
 */
function getType($: mio.IHtmlDocument): string {
  let text = $('td:contains(Type:)').next().text();
  let match = text.match(/^(.*)\s+\(.*\)$/);
  return match ? match[1] : text;
}
