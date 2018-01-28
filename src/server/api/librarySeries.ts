import * as express from 'express';
import * as fs from 'fs-extra';
import * as mio from '../';
import shared = mio.shared;

export async function librarySeriesAsync(request: express.Request, response: express.Response) {
  let metadataSeriesPath = shared.path.normal(request.params.providerName, request.params.seriesName + shared.extension.json);
  let metadataSeriesExists = await fs.pathExists(metadataSeriesPath);
  if (metadataSeriesExists) {
    let metadataSeries = await fs.readJson(metadataSeriesPath) as shared.IStoreSeries;
    let directoryPath = shared.path.normal(request.params.providerName, request.params.seriesName);
    let directoryExists = await fs.pathExists(directoryPath);
    let result = metadataSeries as mio.ILibrarySeries;
    if (directoryExists) {
      let fileNames = await fs.readdir(shared.path.normal(request.params.providerName, request.params.seriesName));
      for (let item of result.items) {
        let itemName = shared.nameOf(metadataSeries, item) + shared.extension.cbz;
        item.exists = fileNames.indexOf(itemName) !== -1;
      }
    }
    response.send(result);
  } else {
    response.sendStatus(404);
  }
}
