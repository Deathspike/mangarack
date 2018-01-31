import * as express from 'express';
import * as fs from 'fs-extra';
import * as mio from '../';
import shared = mio.shared;

export async function librarySeriesAsync(request: express.Request, response: express.Response) {
  let metadataSeriesPath = shared.path.normal(request.params.providerName, request.params.seriesName + shared.extension.json);
  let metadataSeriesExists = await fs.pathExists(metadataSeriesPath);
  if (metadataSeriesExists) {
    let metadataSeries = await fs.readJson(metadataSeriesPath) as shared.IMetadataSeries;
    let seriesPath = shared.path.normal(request.params.providerName, request.params.seriesName);
    let seriesExists = await fs.pathExists(seriesPath);
    let librarySeries = metadataSeries as shared.ILibrarySeries;
    if (seriesExists) {
      let fileNames = await fs.readdir(shared.path.normal(request.params.providerName, request.params.seriesName));
      for (let librarySeriesChapter of librarySeries.chapters) {
        let chapterName = shared.nameOf(metadataSeries, librarySeriesChapter) + shared.extension.cbz;
        librarySeriesChapter.exists = fileNames.indexOf(chapterName) !== -1;
      }
    }
    response.send(librarySeries);
  } else {
    response.sendStatus(404);
  }
}
