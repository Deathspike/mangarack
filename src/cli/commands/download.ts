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
        await mio.usingAsync(mio.scrapeAsync(browser, url), async series => {
          if (series.title !== metaProvider[url]) throw new Error(`Series at ${url} property changed: title`)
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

export async function downloadSeriesAsync(series: mio.IScraperSeries) {
  await series.chapters.reduce((p, c) => p.then(() => downloadSeriesItemAsync(series, c)), Promise.resolve());
  await cleanAsync(series);
}

export async function downloadSeriesItemAsync(series: mio.IScraperSeries, seriesChapter: mio.IScraperSeriesChapter) {
  let chapterName = shared.nameOf(series.title, seriesChapter);
  let chapterPath = shared.path.normal(series.providerName, series.title, chapterName + shared.extension.cbz);
  let chapterExists = await fs.pathExists(chapterPath);
  if (!chapterExists) {
    console.log(`Fetching ${chapterName}`);
    let chapter = archiver.create('zip', {store: true});
    let timer = new mio.Timer();
    await fs.ensureDir(path.dirname(chapterPath));
    chapter.pipe(fs.createWriteStream(chapterPath + shared.extension.tmp));
    await mio.usingAsync(seriesChapter.iteratorAsync(), async iterator => {
      try {
        let metaChapterPages = await archiveAsync(chapter, iterator);
        let metaChapter = transformMetadata(seriesChapter, metaChapterPages);
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

async function archiveAsync(chapter: archiver.Archiver, iterator: mio.IScraperIterator) {
  let currentPageNumber = 1;
  let pages = [];
  while (await iterator.moveAsync()) {
    let buffer = await iterator.currentAsync();
    let imageInfo = imageSize(buffer);
    let name = `${shared.format(currentPageNumber++, 3)}.${imageInfo.type}`;
    chapter.append(buffer, {name});
    pages.push({name, height: imageInfo.height, width: imageInfo.width});
  }
  return pages;
}

async function cleanAsync(series: mio.IScraperSeries) {
  let chapterPaths = series.chapters.map(seriesChapter => shared.path.normal(series.providerName, series.title, shared.nameOf(series.title, seriesChapter) + shared.extension.cbz));
  let fileNames = await fs.readdir(shared.path.normal(series.providerName, series.title));
  let filePaths = fileNames.map(fileName => shared.path.normal(series.providerName, series.title, fileName));
  for (let filePath of filePaths) {
    let fileExtension = path.extname(filePath);
    if (fileExtension === shared.extension.cbz && chapterPaths.indexOf(filePath) === -1) {
      await fs.rename(filePath, filePath + shared.extension.del);
    }
  }
}

function transformMetadata(seriesChapter: mio.IScraperSeriesChapter, pages: shared.IMetaChapterPage[]): shared.IMetaChapter {
  return {
    number: seriesChapter.number,
    title: seriesChapter.title,
    pages: pages,
    volume: seriesChapter.volume
  };
}
