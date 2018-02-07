import * as express from 'express';
import * as fs from 'fs-extra';
import * as mio from '../';
import * as path from 'path';
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
      let chapterFileMap = {} as {[fileName: string]: shared.IApiSeriesChapter};
      let fileNames = await fs.readdir(shared.path.normal(request.params.providerName, request.params.seriesTitle));
      for (let seriesChapter of series.chapters) {
        let chapterName = shared.nameOf(series.title, seriesChapter) + shared.extension.cbz;
        seriesChapter.downloaded = fileNames.indexOf(chapterName) !== -1;
        seriesChapter.exists = true;
        chapterFileMap[chapterName] = seriesChapter;
      }
      for (let fileName of fileNames) {
        let fileExtension = path.extname(fileName);
        let isDeleted = fileExtension === shared.extension.del
        if (!chapterFileMap[fileName] && (fileExtension === shared.extension.cbz || isDeleted)) {
          let metaChapterName = (isDeleted ? fileName.substr(0, fileName.length - fileExtension.length) : fileName) + shared.extension.json;
          let metaChapterPath = shared.path.normal(request.params.providerName, request.params.seriesTitle, metaChapterName);
          let metaChapter = await fs.readJson(metaChapterPath) as shared.IMetaChapter;
          series.chapters.push({downloaded: true, exists: false, number: metaChapter.number, title: metaChapter.title, volume: metaChapter.volume});
        }
      }
    }
    series.chapters.sort(orderVolumeAndNumber);
    response.send(series);
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
