import * as archiver from 'archiver';
import * as fs from 'fs-extra';
import * as mio from '../';
import * as path from 'path';
import * as imageSize from 'image-size';
import * as sanitizeFilename from 'sanitize-filename';
import shared = mio.shared;

export async function downloadAsync() {
  await mio.usingAsync(mio.Browser.createAsync(), async (browser) => {
    for (let providerName of shared.settings.providerNames) {
      let providerPath = shared.path.normal(providerName + shared.extension.json);
      let providerExists = await fs.pathExists(providerPath);
      let provider = providerExists ? await fs.readJson(providerPath) as shared.IStoreProvider : {};
      for (let url in provider) {
        let timer = new mio.Timer();
        console.log(`Awaiting ${url}`);
        await mio.usingAsync(mio.seriesAsync(browser, url), async (series) => {
          if (series.title !== provider[url]) throw new Error(`Series at ${url} property changed: title`)
          if (series.url !== url) throw new Error(`Series at ${url} property changed: url`);
          console.log(`Fetching ${series.title}`);
          await mio.commands.updateSeriesAsync(series);
          await downloadSeriesAsync(series);
          console.log(`Finished ${series.title} (${timer})`);
        });
      }
    }
  });
}

export async function downloadSeriesAsync(series: mio.IProviderSeries) {
  await series.items.reduce((p, c) => p.then(() => downloadSeriesItemAsync(series, c)), Promise.resolve());
  await cleanAsync(series);
}

export async function downloadSeriesItemAsync(series: mio.IProviderSeries, seriesItem: mio.IProviderSeriesItem) {
  let itemName = nameOf(series, seriesItem);
  let itemPath = shared.path.normal(series.providerName, series.title, itemName + shared.extension.cbz);
  let itemExists = await fs.pathExists(itemPath);
  if (!itemExists) {
    console.log(`Fetching ${itemName}`);
    let archive = archiver.create('zip', {store: true});
    let timer = new mio.Timer();
    await fs.ensureDir(path.dirname(itemPath));
    archive.pipe(fs.createWriteStream(itemPath + shared.extension.tmp));
    await mio.usingAsync(seriesItem.iteratorAsync(), async (iterator) => {
      try {
        let pages = await archiveAsync(iterator, archive);
        archive.finalize();
        await fs.writeJson(itemPath + shared.extension.json, transform(seriesItem, pages), {spaces: 2});
        await fs.rename(itemPath + shared.extension.tmp, itemPath);
        console.log(`Finished ${itemName} (${timer})`);
      } catch (error) {
        await fs.unlink(itemPath + shared.extension.tmp);
        throw error;
      } finally {
        archive.abort();
      }
    });
  }
}

async function archiveAsync(iterator: mio.IProviderIterator, archive: archiver.Archiver) {
  let currentPage = 1;
  let pages: shared.IStoreSeriesItemPage[] = [];
  while (await iterator.moveAsync()) {
    let buffer = await iterator.currentAsync();
    let imageData = imageSize(buffer);
    let name = `${mio.format(currentPage++, 3)}.${imageData.type}`;
    archive.append(buffer, {name});
    pages.push({name, height: imageData.height, width: imageData.width});
  }
  return pages;
}

async function cleanAsync(series: mio.IProviderSeries) {
  let seriesName = sanitizeFilename(series.title);
  let fileNames = await fs.readdir(shared.path.normal(series.providerName, seriesName));
  let filePaths = fileNames.map(fileName => shared.path.normal(series.providerName, seriesName, fileName));
  let itemPaths = series.items.map(seriesItem => shared.path.normal(series.providerName, seriesName, nameOf(series, seriesItem) + shared.extension.cbz));
  for (let filePath of filePaths) {
    if (path.extname(filePath) === shared.extension.cbz && itemPaths.indexOf(filePath) === -1) {
      await fs.rename(filePath, filePath + shared.extension.del);
    }
  }
}

function nameOf(series: mio.IProviderSeries, seriesItem: mio.IProviderSeriesItem) {
  let title = sanitizeFilename(series.title);
  if (title && typeof seriesItem.volume !== 'undefined') {
    return `${title} V${mio.format(seriesItem.volume, 2)} #${mio.format(seriesItem.number, 3)}`;
  } else if (title) {
    return `${title} #${mio.format(seriesItem.number, 3)}`;
  } else {
    throw new Error('Invalid series item name');
  }
}

function transform(seriesItem: mio.IProviderSeriesItem, pages: shared.IStoreSeriesItemPage[]): shared.IStoreSeriesItem {
  return {
    number: seriesItem.number,
    pages: pages,
    title: seriesItem.title,
    volume: seriesItem.volume
  };
}
