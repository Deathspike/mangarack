import * as fs from 'fs-extra';
import * as mio from '../';
import shared = mio.shared;

export async function createAsync(urls: string[]) {
  await mio.usingAsync(mio.Browser.createAsync(), async browser => {
    for (let url of urls) {
      let timer = new mio.Timer();
      console.log(`Awaiting ${url}`);
      await mio.usingAsync(mio.scrapeAsync(browser, url), async scraperSeries => {
        console.log(`Fetching ${scraperSeries.name}`);
        let metaProviderPath = shared.path.normal(scraperSeries.providerName + shared.extension.json);
        let metaProviderExists = await fs.pathExists(metaProviderPath);
        let metaProvider = metaProviderExists ? await fs.readJson(metaProviderPath) as shared.IMetaProvider : {};
        if (!metaProvider[scraperSeries.url]) {
          await createSeriesAsync(scraperSeries);
          console.log(`Finished ${scraperSeries.name} (${timer})`);
        } else {
          console.log(`Canceled ${scraperSeries.name} (${timer})`);
        }
      });
    }
  });
}

export async function createSeriesAsync(scraperSeries: mio.IScraperSeries) {
  let metaProviderPath = shared.path.normal(scraperSeries.providerName + shared.extension.json);
  let metaProviderExists = await fs.pathExists(metaProviderPath);
  let metaProvider = metaProviderExists ? await fs.readJson(metaProviderPath) as shared.IMetaProvider : {};
  metaProvider[scraperSeries.url] = scraperSeries.name;
  await mio.commands.updateSeriesAsync(scraperSeries);
  await fs.writeJson(metaProviderPath, metaProvider, {spaces: 2});
}
