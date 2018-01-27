import * as fs from 'fs-extra';
import * as mio from '../';
import shared = mio.shared;

export async function createAsync(urls: string[]) {
  await mio.usingAsync(mio.Browser.createAsync(), async (browser) => {
    for (let url of urls) {
      let timer = new mio.Timer();
      console.log(`Awaiting ${url}`);
      await mio.usingAsync(mio.providerAsync(browser, url), async (series) => {
        console.log(`Fetching ${series.title}`);
        let providerPath = shared.path.normal(series.providerName + shared.extension.json);
        let providerExists = await fs.pathExists(providerPath);
        let provider = providerExists ? await fs.readJson(providerPath) as mio.IStoreProvider : {};
        if (!provider[series.url]) {
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
  let providerPath = shared.path.normal(series.providerName + shared.extension.json);
  let providerExists = await fs.pathExists(providerPath);
  let provider = providerExists ? await fs.readJson(providerPath) as mio.IStoreProvider : {};
  provider[series.url] = series.title;
  await mio.updateSeriesAsync(series);
  await fs.writeJson(providerPath, provider, {spaces: 2});
}
