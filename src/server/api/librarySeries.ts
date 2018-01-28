import * as express from 'express';
import * as fs from 'fs-extra';
import * as mio from '../';
import shared = mio.shared;

export async function librarySeriesAsync(request: express.Request, response: express.Response) {
  let metadataPath = shared.path.normal(request.params.providerName, request.params.seriesName + shared.extension.json);
  let metadataExists = await fs.pathExists(metadataPath);
  if (metadataExists) {
    let series = await fs.readJson(metadataPath) as shared.IStoreSeries;
    let seriesPath = shared.path.normal(request.params.providerName, request.params.seriesName);
    let seriesExists = await fs.pathExists(seriesPath);
    let result: mio.ILibrarySeries = series;
    if (seriesExists) {
      let fileNames = await fs.readdir(shared.path.normal(request.params.providerName, request.params.seriesName));
      for (let item of result.items) {
        let itemName = shared.nameOf(series, item) + shared.extension.cbz;
        item.exists = fileNames.indexOf(itemName) !== -1;
      }
    }
    response.send(result);
  } else {
    response.sendStatus(404);
  }
}
