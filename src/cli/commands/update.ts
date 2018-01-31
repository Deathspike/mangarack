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
        let metadataProviderPath = shared.path.normal(scraperSeries.providerName + shared.extension.json);
        let metadataProviderExists = await fs.pathExists(metadataProviderPath);
        let metadataProvider = metadataProviderExists ? await fs.readJson(metadataProviderPath) as shared.IMetadataProvider : {};
        if (metadataProvider[scraperSeries.url]) {
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
  let metadataSeriesPath = shared.path.normal(scraperSeries.providerName, scraperSeries.title + shared.extension.json);
  let metadataSeries = transformMetadata(scraperSeries, scraperSeriesImage);
  await fs.ensureDir(path.dirname(metadataSeriesPath));
  await fs.writeJson(metadataSeriesPath, metadataSeries, {spaces: 2})
  return true;
}

function transformMetadata(scraperSeries: mio.IScraperSeries, scraperSeriesImage: Buffer): shared.IMetadataSeries {
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
