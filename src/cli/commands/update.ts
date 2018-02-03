import * as fs from 'fs-extra';
import * as mio from '../';
import * as path from 'path';
import shared = mio.shared;

export async function updateAsync(urls: string[]) {
  await mio.usingAsync(mio.Browser.createAsync(), async browser => {
    for (let url of urls) {
      let timer = new mio.Timer();
      console.log(`Awaiting ${url}`);
      await mio.usingAsync(mio.scrapeAsync(browser, url), async scraperSeries => {
        console.log(`Fetching ${scraperSeries.title}`);
        let metaProviderPath = shared.path.normal(scraperSeries.providerName + shared.extension.json);
        let metaProviderExists = await fs.pathExists(metaProviderPath);
        let metaProvider = metaProviderExists ? await fs.readJson(metaProviderPath) as shared.IMetaProvider : {};
        if (metaProvider[scraperSeries.url]) {
          if (scraperSeries.title !== metaProvider[url]) throw new Error(`Series at ${url} property changed: title`)
          if (scraperSeries.url !== url) throw new Error(`Series at ${url} property changed: url`);
          await updateSeriesAsync(scraperSeries);
          console.log(`Finished ${scraperSeries.title} (${timer})`);
        } else {
          console.log(`Canceled ${scraperSeries.title} (${timer})`);
        }
      });
    }
  });
}

export async function updateSeriesAsync(scraperSeries: mio.IScraperSeries) {
  let scraperSeriesImage = await scraperSeries.imageAsync();
  let metaSeriesPath = shared.path.normal(scraperSeries.providerName, scraperSeries.title + shared.extension.json);
  let metaSeries = transformMetadata(scraperSeries, scraperSeriesImage);
  await fs.ensureDir(path.dirname(metaSeriesPath));
  await fs.writeJson(metaSeriesPath, metaSeries, {spaces: 2})
  return true;
}

function transformMetadata(scraperSeries: mio.IScraperSeries, scraperSeriesImage: Buffer): shared.IMetaSeries {
  return {
    artists: scraperSeries.artists,
    authors: scraperSeries.authors,
    chapters: scraperSeries.chapters.map(({number, title, volume}) => ({number, title, volume})),
    genres: scraperSeries.genres,
    imageBase64: scraperSeriesImage.toString('base64'),
    summary: scraperSeries.summary,
    title: scraperSeries.title,
    type: scraperSeries.type,
    url: scraperSeries.url
  };
}
