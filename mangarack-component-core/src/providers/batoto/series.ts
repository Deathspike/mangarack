import * as mio from '../../default';
import {createChapter} from './chapter';
import {enhance} from '../enhance';
import {scan} from '../scan';
const httpService = mio.dependency.get<mio.IHttpService>('IHttpService');
const htmlService = mio.dependency.get<mio.IHtmlService>('IHtmlService');
const remapGenreType: mio.IDictionary = {'Oneshot': 'One Shot', 'Sci-fi': 'Science Fiction'};

/**
 * Promises the series.
 * @param address The address.
 * @return The promise for the series.
 */
export async function createSeriesAsync(address: string): Promise<mio.ISeries> {
  let document = await downloadDocumentAsync(address, false);
  return createSeries(document);
}

/**
 * Creates the series.
 * @param document The selector.
 * @return The series.
 */
function createSeries(document: mio.IHtmlServiceDocument): mio.ISeries {
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
async function downloadDocumentAsync(address: string, hasAttemptedLogin: boolean): Promise<mio.IHtmlServiceDocument> {
  let body = await httpService().text(address, mio.ControlType.TimeoutWithRetry).getAsync();
  let document = htmlService().load(body);
  let isLoggedIn = Boolean(document('#user_navigation.logged_in').first().text());
  if (!isLoggedIn) {
    let password = mio.settingService.getString('component.core.batoto.password');
    let username = mio.settingService.getString('component.core.batoto.username');
    if (!hasAttemptedLogin && username && password) {
      const loginAddress = 'https://bato.to/forums/index.php?app=core&module=global&section=login&do=process';
      await httpService().text(loginAddress, mio.ControlType.TimeoutWithRetry, {origin: 'https://bato.to'}).postAsync({
        auth_key: document('input[name=auth_key]').attr('value'),
        ips_password: password,
        ips_username: username,
        referer: document('input[name=referer]').attr('value'),
        rememberMe: '1'
      });
      await mio.promise(callback => setTimeout(callback, 1000));
      return downloadDocumentAsync(address, true);
    } else {
      throw new Error('Invalid \'component.core.batoto.username\' or \'component.core.batoto.password\'.');
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
function downloadImageAsync($: mio.IHtmlServiceDocument): Promise<mio.IBlob> {
  let address = $('img[src*=\'/uploads/\']').first().attr('src');
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
  return $('td:contains(Artist:)').next().find('a')
    .map((_, a) => $(a).text())
    .get();
}

/**
 * Retrieves each author.
 * @param $ The selector.
 * @return Each author.
 */
function getAuthors($: mio.IHtmlServiceDocument): string[] {
  return $('td:contains(Author:)').next().find('a')
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
  $('tr.lang_English').find('a[href*=\'/reader\']').map((_, a) => {
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
function getGenres($: mio.IHtmlServiceDocument): string[] {
  let isMature = Boolean($('.ipsBox .clear').first().next().text());
  let initialArray = (isMature ? ['Mature'] : []);
  return initialArray.concat($('td:contains(Genres:)').next().find('a')
    .map((_, a) => $(a).text())
    .get()
    .map(value => remapGenreType[value] || value));
}

/**
 * Retrieves the summary.
 * @param $ The selector.
 * @return The summary.
 */
function getSummary($: mio.IHtmlServiceDocument): string {
  let html = $('td:contains(Description:)').next().html();
  let text = $('<div />').html(html.replace(/<br\s*\/?>/g, '\n')).text();
  return text;
}

/**
 * Retrieves the title.
 * @param $ The selector.
 * @return The title.
 */
function getTitle($: mio.IHtmlServiceDocument): string {
  return $('h1.ipsType_pagetitle').text();
}

/**
 * Retrieves the type.
 * @param $ The selector.
 * @return The type.
 */
function getType($: mio.IHtmlServiceDocument): string {
  let text = $('td:contains(Type:)').next().text();
  let match = text.match(/^(.*)\s+\(.*\)$/);
  return match ? match[1] : text;
}
