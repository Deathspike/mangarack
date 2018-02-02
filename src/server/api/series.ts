import * as express from 'express';
import * as fs from 'fs-extra';
import * as mio from '../';
import shared = mio.shared;

export async function seriesAsync(request: express.Request, response: express.Response) {
  let metaSeriesPath = shared.path.normal(request.params.providerName, request.params.seriesName + shared.extension.json);
  let metaSeriesExists = await fs.pathExists(metaSeriesPath);
  if (metaSeriesExists) {
    let seriesPath = shared.path.normal(request.params.providerName, request.params.seriesName);
    let seriesExists = await fs.pathExists(seriesPath);
    let metaSeries = await fs.readJson(metaSeriesPath) as shared.IMetaSeries;
    let apiSeries = metaSeries as shared.IApiSeries;
    if (seriesExists) {
      let fileNames = await fs.readdir(shared.path.normal(request.params.providerName, request.params.seriesName));
      for (let apiSeriesChapter of apiSeries.chapters) {
        let chapterName = shared.nameOf(metaSeries, apiSeriesChapter) + shared.extension.cbz;
        apiSeriesChapter.exists = fileNames.indexOf(chapterName) !== -1;
      }
    }
    response.send(apiSeries);
  } else {
    response.sendStatus(404);
  }
}
