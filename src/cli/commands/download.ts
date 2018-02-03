import * as archiver from 'archiver';
import * as fs from 'fs-extra';
import * as mio from '../';
import * as path from 'path';
import * as imageSize from 'image-size';
import shared = mio.shared;

export async function downloadAsync() {
  await mio.usingAsync(mio.Browser.createAsync(), async browser => {
    for (let providerName of shared.settings.providerNames) {
      let metaProviderPath = shared.path.normal(providerName + shared.extension.json);
      let metaProviderExists = await fs.pathExists(metaProviderPath);
      let metaProvider = metaProviderExists ? await fs.readJson(metaProviderPath) as shared.IMetaProvider : {};
      for (let url in metaProvider) {
        let timer = new mio.Timer();
        console.log(`Awaiting ${url}`);
        await mio.usingAsync(mio.scrapeAsync(browser, url), async scraperSeries => {
          if (scraperSeries.title !== metaProvider[url]) throw new Error(`Series at ${url} property changed: title`)
          if (scraperSeries.url !== url) throw new Error(`Series at ${url} property changed: url`);
          console.log(`Fetching ${scraperSeries.title}`);
          await mio.commands.updateSeriesAsync(scraperSeries);
          await downloadSeriesAsync(scraperSeries);
          console.log(`Finished ${scraperSeries.title} (${timer})`);
        });
      }
    }
  });
}

export async function downloadSeriesAsync(scraperSeries: mio.IScraperSeries) {
  await scraperSeries.chapters.reduce((p, c) => p.then(() => downloadSeriesItemAsync(scraperSeries, c)), Promise.resolve());
  await cleanAsync(scraperSeries);
}

export async function downloadSeriesItemAsync(scraperSeries: mio.IScraperSeries, scraperSeriesChapter: mio.IScraperSeriesChapter) {
  let chapterName = shared.nameOf(scraperSeries, scraperSeriesChapter);
  let chapterPath = shared.path.normal(scraperSeries.providerName, scraperSeries.title, chapterName + shared.extension.cbz);
  let chapterExists = await fs.pathExists(chapterPath);
  if (!chapterExists) {
    console.log(`Fetching ${chapterName}`);
    let chapter = archiver.create('zip', {store: true});
    let timer = new mio.Timer();
    await fs.ensureDir(path.dirname(chapterPath));
    chapter.pipe(fs.createWriteStream(chapterPath + shared.extension.tmp));
    await mio.usingAsync(scraperSeriesChapter.iteratorAsync(), async scraperIterator => {
      try {
        let metaChapterPages = await archiveAsync(chapter, scraperIterator);
        let metaChapter = transformMetadata(scraperSeriesChapter, metaChapterPages);
        chapter.finalize();
        await fs.writeJson(chapterPath + shared.extension.json, metaChapter, {spaces: 2});
        await fs.rename(chapterPath + shared.extension.tmp, chapterPath);
        console.log(`Finished ${chapterName} (${timer})`);
      } catch (error) {
        await fs.unlink(chapterPath + shared.extension.tmp);
        throw error;
      } finally {
        chapter.abort();
      }
    });
  }
}

async function archiveAsync(chapter: archiver.Archiver, scraperIterator: mio.IScraperIterator) {
  let currentPageNumber = 1;
  let pages = [];
  while (await scraperIterator.moveAsync()) {
    let buffer = await scraperIterator.currentAsync();
    let imageInfo = imageSize(buffer);
    let name = `${shared.format(currentPageNumber++, 3)}.${imageInfo.type}`;
    chapter.append(buffer, {name});
    pages.push({name, height: imageInfo.height, width: imageInfo.width});
  }
  return pages;
}

async function cleanAsync(scraperSeries: mio.IScraperSeries) {
  let chapterPaths = scraperSeries.chapters.map(scraperSeriesChapter => shared.path.normal(scraperSeries.providerName, scraperSeries.title, shared.nameOf(scraperSeries, scraperSeriesChapter) + shared.extension.cbz));
  let fileNames = await fs.readdir(shared.path.normal(scraperSeries.providerName, scraperSeries.title));
  let filePaths = fileNames.map(fileName => shared.path.normal(scraperSeries.providerName, scraperSeries.title, fileName));
  for (let filePath of filePaths) {
    let fileExtension = path.extname(filePath);
    if (fileExtension === shared.extension.cbz && chapterPaths.indexOf(filePath) === -1) {
      await fs.rename(filePath, filePath + shared.extension.del);
    }
  }
}

function transformMetadata(scraperSeriesChapter: mio.IScraperSeriesChapter, pages: shared.IMetaChapterPage[]): shared.IMetaChapter {
  return {
    number: scraperSeriesChapter.number,
    title: scraperSeriesChapter.title,
    pages: pages,
    volume: scraperSeriesChapter.volume
  };
}
