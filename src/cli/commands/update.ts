import * as fs from 'fs-extra';
import * as mio from '../';
import * as path from 'path';
import shared = mio.shared;

export async function updateAsync(urls: string[]) {
  await mio.usingAsync(mio.Browser.createAsync(), async (browser) => {
    for (let url of urls) {
      let timer = new mio.Timer();
      console.log(`Awaiting ${url}`);
      await mio.usingAsync(mio.seriesAsync(browser, url), async (series) => {
        console.log(`Fetching ${series.title}`);
        let providerPath = shared.path.normal(series.providerName + shared.extension.json);
        let providerExists = await fs.pathExists(providerPath);
        let provider = providerExists ? await fs.readJson(providerPath) as shared.IStoreProvider : {};
        if (provider[series.url]) {
          await updateSeriesAsync(series);
          console.log(`Finished ${series.title} (${timer})`);
        } else {
          console.log(`Canceled ${series.title} (${timer})`);
        }
      });
    }
  });
}

export async function updateSeriesAsync(series: mio.IProviderSeries) {
  let seriesPath = shared.path.normal(series.providerName, series.title + shared.extension.json);
  let seriesImage = await series.imageAsync();
  await fs.ensureDir(path.dirname(seriesPath));
  await fs.writeJson(seriesPath, transform(series, seriesImage), {spaces: 2})
  return true;
}

function transform(series: mio.IProviderSeries, seriesImage: Buffer): shared.IStoreSeries {
  return {
    artists: series.artists,
    authors: series.authors,
    genres: series.genres,
    imageBase64: seriesImage.toString('base64'),
    items: series.items.map(({number, title, volume}) => ({number, title, volume})),
    summary: series.summary,
    title: series.title,
    type: series.type,
    url: series.url
  };
}
