import * as fs from 'fs-extra';
import * as mio from '../';
import * as path from 'path';
import shared = mio.shared;

export async function updateAsync(urls: string[]) {
  await mio.usingAsync(mio.Browser.createAsync(), async browser => {
    for (let url of urls) {
      let timer = new mio.Timer();
      console.log(`Awaiting ${url}`);
      await mio.usingAsync(mio.scrapeAsync(browser, url), async series => {
        console.log(`Fetching ${series.title}`);
        let metaProviderPath = shared.path.normal(series.providerName + shared.extension.json);
        let metaProviderExists = await fs.pathExists(metaProviderPath);
        let metaProvider = metaProviderExists ? await fs.readJson(metaProviderPath) as shared.IMetaProvider : {};
        if (metaProvider[series.url]) {
          if (series.title !== metaProvider[url]) throw new Error(`Series at ${url} property changed: title`)
          if (series.url !== url) throw new Error(`Series at ${url} property changed: url`);
          await updateSeriesAsync(series);
          console.log(`Finished ${series.title} (${timer})`);
        } else {
          console.log(`Canceled ${series.title} (${timer})`);
        }
      });
    }
  });
}

export async function updateSeriesAsync(series: mio.IScraperSeries) {
  let seriesImage = await series.imageAsync();
  let metaSeriesPath = shared.path.normal(series.providerName, series.title + shared.extension.json);
  let metaSeries = transformMetadata(series, seriesImage);
  await fs.ensureDir(path.dirname(metaSeriesPath));
  await fs.writeJson(metaSeriesPath, metaSeries, {spaces: 2})
  return true;
}

function transformMetadata(series: mio.IScraperSeries, seriesImage: Buffer): shared.IMetaSeries {
  return {
    artists: series.artists,
    authors: series.authors,
    chapters: series.chapters.map(({number, title, volume}) => ({number, title, volume})),
    genres: series.genres,
    imageBase64: seriesImage.toString('base64'),
    summary: series.summary,
    title: series.title,
    type: series.type,
    url: series.url
  };
}
