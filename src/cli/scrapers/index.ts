import * as mangafox from './mangafox';
import * as mio from '../';
const scrapers = [mangafox.scrapeAsync];

export function scrapeAsync(browser: mio.Browser, url: string): Promise<mio.IScraperSeries> | undefined {
  for (let provider of scrapers) {
    let series = provider(browser, url);
    if (series) return series;
  }
  return undefined;
}
