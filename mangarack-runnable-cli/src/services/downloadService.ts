import * as fs from 'fs';
import * as mio from '../default';

/**
 * Represents the download service.
 */
export let downloadService: mio.IDownloadService = {
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
    if (chapterName.hasValue && chapterPath.hasValue) {
      let chapterExists = await mio.promise<boolean>(callback => fs.exists(chapterPath.value, exists => callback(undefined, exists)));
      if (chapterExists.hasValue && chapterExists.hasValue && !chapterExists.value) {
        console.log(`Fetching ${chapterName.value}`);
        let beginTime = Date.now();
        let pages = await chapter.pagesAsync();
        await downloadService.pagesAsync(provider, series, seriesPreviewImage, chapter, pages);
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
    if (chapterPath.hasValue) {
      let zip = mio.zipService.create(chapterPath.value);
      for (let page of pages) {
        let image = await page.imageAsync();
        let processedImage = await mio.imageService.processAsync(provider, image);
        if (processedImage.hasValue) {
          await zip.writeAsync(`${format(3, page.number)}.${mio.helperService.getImageExtension(processedImage.value)}`, processedImage.value);
        } else {
          throw new Error(`Invalid processed page #${page.number}`);
        }
      }
      await zip.writeAsync(`000.${mio.helperService.getImageExtension(seriesPreviewImage)}`, seriesPreviewImage);
      await zip.writeAsync('ComicInfo.xml', mio.metaService.createXml(series, chapter, pages));
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
      await downloadService.chapterAsync(provider, series, seriesPreviewImage, chapter);
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
  if (seriesName.hasValue) {
    let seriesExists = await mio.promise<boolean>(callback => fs.exists(seriesName.value, exists => callback(undefined, exists)));
    if (seriesExists.hasValue && seriesExists.value) {
      let fileNames = await mio.promise<string[]>(callback => fs.readdir(seriesName.value, callback));
      if (fileNames.hasValue) {
        let chapterPaths = series.chapters.map(chapter => getChapterPath(series, chapter).value);
        let filePaths = fileNames.value.map(fileName => `${seriesName.value}/${fileName}`);
        for (let filePath of filePaths) {
          if (chapterPaths.indexOf(filePath) === -1 && /\.cbz$/.test(filePath)) {
            await mio.promise<void>(callback => fs.rename(filePath, `${filePath}.mrdel`, callback));
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
  if (!chapter.number.hasValue) {
    return mio.option<string>();
  } else {
    let title = getSeriesName(series);
    if (!title.hasValue) {
      return mio.option<string>();
    } else if (!chapter.volume.hasValue) {
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
  return mio.option(seriesName.hasValue && chapterName.hasValue ? `${seriesName.value}/${chapterName.value}` : undefined);
}

/**
 * Gets the series name.
 * @param series The series.
 * @return The series name.
 */
function getSeriesName(series: mio.ISeries): mio.IOption<string> {
  return mio.option(series.title
    .replace(/["<>\|:\*\?\\\/]/g, '')
    .replace(/\.$/, '. (Suffixed)') || undefined);
}

/**
 * Formats the number (with possible fraction digits) to be prefixed with leading zeros.
 * @param minimumWholeNumberLength The minimum length of whole numbers.
 * @param value The value.
 * @return The number prefixed with leading zeros.
 */
function format(minimumWholeNumberLength: number, value: number): string {
  let result = value.toString();
  let index = result.indexOf('.');
  for (let i = minimumWholeNumberLength - (index >= 0 ? index : result.length); i > 0; i--) {
    result = '0' + result;
  }
  return result;
}

/**
 * Returns the elapsed time in a pretty format.
 * @param beginTime The begin time.
 * @return The elapsed time in a pretty format.
 */
function prettyElapsedTime(beginTime: number): string {
  let elapsedTime = Date.now() - beginTime;
  let seconds = format(2, Math.floor(elapsedTime / 1000) % 60);
  let minutes = format(2, Math.floor(elapsedTime / 1000 / 60) % 60);
  let hours = format(2, Math.floor(elapsedTime / 1000 / 60 / 60));
  return `(${hours}:${minutes}:${seconds})`;
}
