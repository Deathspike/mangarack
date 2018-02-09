import * as mio from '../../';
import {evaluateSeries} from './evaluators/series';
import {ScraperSeries} from './ScraperSeries';

export function scrapeAsync(browser: mio.Browser, url: string) {
  let cleanUrl = rewriteUrl(url);
  if (!/^http:\/\/fanfox\.net\/manga\/.+\/$/i.test(cleanUrl)) return undefined;
  return createAsync(browser, cleanUrl);
}

async function createAsync(browser: mio.Browser, url: string) {
  let browserTab = await browser.tabAsync(url);
  let series = await browserTab.runIsolatedAsync(evaluateSeries);
  return new ScraperSeries(browserTab, series);
}

function rewriteUrl(url: string) {
  let match: RegExpMatchArray | null;
  if ((match = url.match(/^http:\/\/mangafox\.la\/manga\/(.+\/)\/$/i))) {
    return `http://fanfox.net/manga/${match[1]}/`;
  } else {
    return url;
  }
}
