import * as fs from 'fs-extra';
import * as mio from '../';
import shared = mio.shared;

export async function createAsync(urls: string[]) {
  await mio.usingAsync(mio.Browser.createAsync(), async browser => {
    for (let url of urls) {
      let timer = new mio.Timer();
      console.log(`Awaiting ${url}`);
      await mio.usingAsync(mio.scrapeAsync(browser, url), async scraperSeries => {
        console.log(`Fetching ${scraperSeries.title}`);
        let metadataProviderPath = shared.path.normal(scraperSeries.providerName + shared.extension.json);
        let metadataProviderExists = await fs.pathExists(metadataProviderPath);
        let metadataProvider = metadataProviderExists ? await fs.readJson(metadataProviderPath) as shared.IMetadataProvider : {};
        if (!metadataProvider[scraperSeries.url]) {
          await createSeriesAsync(scraperSeries);
          console.log(`Finished ${scraperSeries.title} (${timer})`);
        } else {
          console.log(`Canceled ${scraperSeries.title} (${timer})`);
        }
      });
    }
  });
}

export async function createSeriesAsync(scraperSeries: mio.IScraperSeries) {
  let metadataProviderPath = shared.path.normal(scraperSeries.providerName + shared.extension.json);
  let metadataProviderExists = await fs.pathExists(metadataProviderPath);
  let metadataProvider = metadataProviderExists ? await fs.readJson(metadataProviderPath) as shared.IMetadataProvider : {};
  metadataProvider[scraperSeries.url] = scraperSeries.title;
  await mio.commands.updateSeriesAsync(scraperSeries);
  await fs.writeJson(metadataProviderPath, metadataProvider, {spaces: 2});
}
