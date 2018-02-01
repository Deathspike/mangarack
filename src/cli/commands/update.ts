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
        console.log(`Fetching ${scraperSeries.name}`);
        let metaProviderPath = shared.path.normal(scraperSeries.providerName + shared.extension.json);
        let metaProviderExists = await fs.pathExists(metaProviderPath);
        let metaProvider = metaProviderExists ? await fs.readJson(metaProviderPath) as shared.IMetaProvider : {};
        if (metaProvider[scraperSeries.url]) {
          await updateSeriesAsync(scraperSeries);
          console.log(`Finished ${scraperSeries.name} (${timer})`);
        } else {
          console.log(`Canceled ${scraperSeries.name} (${timer})`);
        }
      });
    }
  });
}

export async function updateSeriesAsync(scraperSeries: mio.IScraperSeries) {
  let scraperSeriesImage = await scraperSeries.imageAsync();
  let metaSeriesPath = shared.path.normal(scraperSeries.providerName, scraperSeries.name + shared.extension.json);
  let metaSeries = transformMetadata(scraperSeries, scraperSeriesImage);
  await fs.ensureDir(path.dirname(metaSeriesPath));
  await fs.writeJson(metaSeriesPath, metaSeries, {spaces: 2})
  return true;
}

function transformMetadata(scraperSeries: mio.IScraperSeries, scraperSeriesImage: Buffer): shared.IMetaSeries {
  return {
    artists: scraperSeries.artists,
    authors: scraperSeries.authors,
    chapters: scraperSeries.chapters.map(({name, number, volume}) => ({name, number, volume})),
    genres: scraperSeries.genres,
    imageBase64: scraperSeriesImage.toString('base64'),
    name: scraperSeries.name,
    summary: scraperSeries.summary,
    type: scraperSeries.type,
    url: scraperSeries.url
  };
}
