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
      let fileNames = await fs.readdir(seriesPath);
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
        if (!seriesChapterFileNames[fileName] && (fileExtension === shared.extension.cbz || fileExtension === shared.extension.del)) {
          let chapterName = path.basename(fileName);
          let scanResult = scan(chapterName);
          seriesChapters.push({
            available: false,
            downloaded: true,
            name: chapterName,
            number: scanResult.number,
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

// [Improvement] orderVolumeAndNumber should be moved to a more logical file.
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
    let number = parseFloat(match[2]);
    let volume = match[1] ? parseFloat(match[1]) : undefined;
    return {number, volume};
  } else {
    throw new Error('Invalid series chapter name');
  }
}
