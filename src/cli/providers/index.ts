import * as mangafox from './mangafox';
import * as mio from '../';
const providers = [mangafox.seriesAsync];

export async function seriesAsync(browser: mio.Browser, url: string): Promise<mio.IProviderSeries | undefined> {
  for (let provider of providers) {
    let series = await provider(browser, url);
    if (series) return series;
  }
  return undefined;
}
