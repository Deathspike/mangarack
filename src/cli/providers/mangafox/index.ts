import * as mio from '../../';
import {evaluateSeries} from './evaluators/series';
import {Series} from './series';

export async function seriesAsync(browser: mio.Browser, url: string) {
  if (!/^http:\/\/mangafox\.la\/manga\/.+\/$/i.test(url)) return undefined;
  let browserTab = await browser.tabAsync(url);
  let series = await browserTab.runIsolatedAsync(evaluateSeries);
  return new Series(browserTab, series);
}
