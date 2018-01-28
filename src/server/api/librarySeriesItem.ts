import * as express from 'express';
import * as fs from 'fs-extra';
import * as mio from '../';
import shared = mio.shared;

export async function librarySeriesItemAsync(request: express.Request, response: express.Response) {
  let metadataSeriesItemName = request.params.seriesItemName + shared.extension.cbz + shared.extension.json;
  let metadataSeriesItemPath = shared.path.normal(request.params.providerName, request.params.seriesName, metadataSeriesItemName);
  let metadataSeriesItemExists = await fs.pathExists(metadataSeriesItemPath);
  if (metadataSeriesItemExists) {
    let metadataSeriesItem = await fs.readJson(metadataSeriesItemPath) as shared.IStoreSeriesItem;
    let result = metadataSeriesItem as mio.ILibrarySeriesItem;
    response.send(result);
  } else {
    response.sendStatus(404);
  }
}
