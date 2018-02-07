import * as express from 'express';
import * as fs from 'fs-extra';
import * as mio from '../';
import * as path from 'path';
import * as sanitizeFilename from 'sanitize-filename';
import shared = mio.shared;

export async function seriesAsync(request: express.Request, response: express.Response) {
  let metaSeriesPath = shared.path.normal(request.params.providerName, request.params.seriesTitle + shared.extension.json);
  let metaSeriesExists = await fs.pathExists(metaSeriesPath);
  if (metaSeriesExists) {
    let seriesPath = shared.path.normal(request.params.providerName, request.params.seriesTitle);
    let seriesExists = await fs.pathExists(seriesPath);
    let metaSeries = await fs.readJson(metaSeriesPath) as shared.IMetaSeries;
    let series = metaSeries as shared.IApiSeries;
    if (seriesExists) {
      let fileNames = await fs.readdir(shared.path.normal(request.params.providerName, request.params.seriesTitle));
      let seriesChapters = [] as shared.IApiSeriesChapter[];
      let seriesChapterFileNames = {} as {[fileName: string]: number};
      for (let seriesChapter of series.chapters) {
        let chapterName = sanitizeFilename(seriesChapter.name) + shared.extension.cbz;
        let scanResult = scan(seriesChapter.name);
        seriesChapterFileNames[chapterName] = seriesChapters.push({
          available: true,
          downloaded: fileNames.indexOf(chapterName) !== -1,
          name: seriesChapter.name,
          number: scanResult.number,
          title: seriesChapter.title,
          volume: scanResult.volume
        });
      }
      for (let fileName of fileNames) {
        let fileExtension = path.extname(fileName);
        let isDeleted = fileExtension === shared.extension.del
        if (!seriesChapterFileNames[fileName] && (fileExtension === shared.extension.cbz || isDeleted)) {
          let metaChapterName = (isDeleted ? fileName.substr(0, fileName.length - fileExtension.length) : fileName) + shared.extension.json;
          let metaChapterPath = shared.path.normal(request.params.providerName, request.params.seriesTitle, metaChapterName);
          let metaChapter = await fs.readJson(metaChapterPath) as shared.IMetaChapter;
          let scanResult = scan(metaChapter.name);
          series.chapters.push({
            available: false,
            downloaded: true,
            name: metaChapter.name,
            number: scanResult.number,
            title: metaChapter.title,
            volume: scanResult.volume
          });
        }
      }
      series.chapters = seriesChapters.sort(orderVolumeAndNumber);
      response.send(series);
    } else {
      response.send(series);
    }
  } else {
    response.sendStatus(404);
  }
}

function orderVolumeAndNumber(a: shared.IApiSeriesChapter, b: shared.IApiSeriesChapter) {
  if (typeof a.volume !== 'undefined') {
    if (typeof b.volume === 'undefined') {
      return 1;
    } else if (a.volume === b.volume) {
      return b.number - a.number;
    } else {
      return b.volume - a.volume;
    }
  } else if (typeof b.volume !== 'undefined') {
    return -1;
  } else {
    return b.number - a.number;
  }
}

// [Improvement] Scan should handle other providers and formats too.
function scan(name: string) {
  let match = name.match(/(?:v([0-9]+)\s)?c([0-9]+(?:\.[0-9+]+)?)$/);
  if (match) {
    let number = parseFloat(match[1]);
    let volume = parseFloat(match[2]);
    return {number, volume};
  } else {
    throw new Error('Invalid series chapter name');
  }
}
