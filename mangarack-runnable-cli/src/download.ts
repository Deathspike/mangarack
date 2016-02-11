'use strict';
import * as fs from 'fs';
import * as mio from './default';

/**
 * Represents download functionality.
 */
export let download = {
  /**
   * Promises to download the chapter.
   * @param provider The provider.
   * @param series The series.
   * @param seriesPreviewImage The series preview image.
   * @param chapter The chapter.
   * @return The promise to download the chapter.
   */
  chapterAsync: async function(provider: mio.IProvider, series: mio.ISeries, seriesPreviewImage: mio.IBlob, chapter: mio.IChapter): Promise<void> {
    let chapterName = getChapterName(series, chapter);
    let chapterPath = getChapterPath(series, chapter);
    if (chapterName.value != null && chapterPath.value != null) {
      let chapterExists = await mio.helper.promisify<boolean>(cb => fs.exists(chapterPath.value, exists => cb(null, exists)));
      if (chapterExists.value != null && chapterExists.value != null && !chapterExists.value) {
        console.log(`Fetching ${chapterName.value}`);
        let beginTime = Date.now();
        let pages = await chapter.pagesAsync();
        await download.pagesAsync(provider, series, seriesPreviewImage, chapter, pages);
        console.log(`Finished ${chapterName.value} ${prettyElapsedTime(beginTime)}`);
      }
    }
  },

  /**
   * Promises to download the pages.
   * @param provider The provider.
   * @param series The series.
   * @param seriesPreviewImage The series preview image.
   * @param chapter The chapter.
   * @param pages The pages.
   * @return The promise to download the pages.
   */
  pagesAsync: async function(provider: mio.IProvider, series: mio.ISeries, seriesPreviewImage: mio.IBlob, chapter: mio.IChapter, pages: mio.IPage[]): Promise<void> {
    let chapterPath = getChapterPath(series, chapter);
    if (chapterPath.value != null) {
      let zip = mio.zip.create(chapterPath.value);
      for (let page of pages) {
        let image = await page.imageAsync();
        let processedImage = await mio.image.processAsync(provider, image);
        if (processedImage.value != null) {
          await zip.writeAsync(`${format(3, page.number)}.${mio.helper.getImageExtension(processedImage.value)}`, processedImage.value);
        } else {
          throw new Error(`Invalid processed page #${page.number}`);
        }
      }
      await zip.writeAsync(`000.${mio.helper.getImageExtension(seriesPreviewImage)}`, seriesPreviewImage);
      await zip.writeAsync('ComicInfo.xml', mio.meta.createXml(series, chapter, pages));
      await zip.commitAsync();
    }
  },

  /**
   * Promises to download the series.
   * @param address The address.
   * @return The promise to download the series.
   */
  seriesAsync: async function(address: string): Promise<void> {
    let beginTime = Date.now();
    let provider = mio.openProvider(address);
    let series = await provider.seriesAsync(address);
    let seriesPreviewImage = await series.imageAsync();
    console.log(`Fetching ${series.title}`);
    for (let chapter of series.chapters) {
      await download.chapterAsync(provider, series, seriesPreviewImage, chapter);
    }
    await cleanAsync(series);
    console.log(`Finished ${series.title} ${prettyElapsedTime(beginTime)}`);
  }
};

/**
 * Promises to clean obsolete chapters from the series.
 * @param series The series.
 * @return The promise to clean obsolete chapters from the series.
 */
async function cleanAsync(series: mio.ISeries): Promise<void> {
  let seriesName = getSeriesName(series);
  if (seriesName.value != null) {
    let seriesExists = await mio.helper.promisify<boolean>(cb => fs.exists(seriesName.value, exists => cb(null, exists)));
    if (seriesExists.value) {
      let fileNames = await mio.helper.promisify<string[]>(cb => fs.readdir(seriesName.value, cb));
      if (fileNames.value != null) {
        let chapterPaths = series.chapters.map(chapter => getChapterPath(series, chapter).value);
        let filePaths = fileNames.value.map(fileName => `${seriesName.value}/${fileName}`);
        for (let filePath of filePaths) {
          if (chapterPaths.indexOf(filePath) === -1 && !/\.(mrdel|mrtmp)$/.test(filePath)) {
            await mio.helper.promisify<void>(cb => fs.rename(filePath, `${filePath}.mrdel`, cb));
          }
        }
      }
    }
  }
}

/**
 * Gets the chapter name.
 * @param series The series.
 * @param chapter The chapter.
 * @return The chapter name.
 */
function getChapterName(series: mio.ISeries, chapter: mio.IChapter): mio.IOption<string> {
  if (chapter.number.value == null) {
    return mio.option<string>();
  } else {
    let title = getSeriesName(series);
    if (title.value == null) {
      return mio.option<string>();
    } else if (chapter.volume.value == null) {
      return mio.option(`${title.value} #${format(3, chapter.number.value)}.cbz`);
    } else {
      return mio.option(`${title.value} V${format(2, chapter.volume.value)} #${format(3, chapter.number.value)}.cbz`);
    }
  }
}

/**
 * Gets the chapter path.
 * @param series The series.
 * @param chapter The chapter.
 * @return The chapter path.
 */
function getChapterPath(series: mio.ISeries, chapter: mio.IChapter): mio.IOption<string> {
  let seriesName = getSeriesName(series);
  let chapterName = getChapterName(series, chapter);
  return mio.option(seriesName.value != null && chapterName.value != null ? `${seriesName.value}/${chapterName.value}` : null);
}

/**
 * Gets the series name.
 * @param series The series.
 * @return The series name.
 */
function getSeriesName(series: mio.ISeries): mio.IOption<string> {
  return mio.option(series.title
    .replace(/["<>\|:\*\?\\\/]/g, '')
    .replace(/\.$/, '. (Suffixed)') || null);
}

/**
 * Formats the number (with possible fraction digits) to be prefixed with leading zeros.
 * @param minimumWholeNumberLength The minimum length of whole numbers.
 * @param number The number.
 * @return The number prefixed with leading zeros.
 */
function format(minimumWholeNumberLength: number, number: number): string {
  let value = number.toString();
  let index = value.indexOf('.');
  for (let i = minimumWholeNumberLength - (index >= 0 ? index : value.length); i > 0; i--) {
    value = '0' + value;
  }
  return value;
}

/**
 * Returns the elapsed time in a pretty format.
 * @param beginTime The begin time.
 * @return The elapsed time in a pretty format.
 */
function prettyElapsedTime(beginTime: number): string {
  let elapsedTime = Date.now() - beginTime;
  var seconds = format(2, Math.floor(elapsedTime / 1000) % 60);
  var minutes = format(2, Math.floor(elapsedTime / 1000 / 60) % 60);
  var hours = format(2, Math.floor(elapsedTime / 1000 / 60 / 60));
  return `(${hours}:${minutes}:${seconds})`;
}
