import * as fs from 'fs-extra';
import * as mio from '../';
import shared = mio.shared;

export async function createAsync(urls: string[]) {
  await mio.usingAsync(mio.Browser.createAsync(), async (browser) => {
    for (let url of urls) {
      let timer = new mio.Timer();
      console.log(`Awaiting ${url}`);
      await mio.usingAsync(mio.seriesAsync(browser, url), async (series) => {
        console.log(`Fetching ${series.title}`);
        let metadataPath = shared.path.normal(series.providerName + shared.extension.json);
        let metadataExists = await fs.pathExists(metadataPath);
        let metadata = metadataExists ? await fs.readJson(metadataPath) as shared.IStoreProvider : {};
        if (!metadata[series.url]) {
          await createSeriesAsync(series);
          console.log(`Finished ${series.title} (${timer})`);
        } else {
          console.log(`Canceled ${series.title} (${timer})`);
        }
      });
    }
  });
}

export async function createSeriesAsync(series: mio.IProviderSeries) {
  let metadataPath = shared.path.normal(series.providerName + shared.extension.json);
  let metadataExists = await fs.pathExists(metadataPath);
  let metadata = metadataExists ? await fs.readJson(metadataPath) as shared.IStoreProvider : {};
  metadata[series.url] = series.title;
  await mio.commands.updateSeriesAsync(series);
  await fs.writeJson(metadataPath, metadata, {spaces: 2});
}
