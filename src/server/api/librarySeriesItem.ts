import * as express from 'express';
import * as fs from 'fs-extra';
import * as mio from '../';
import shared = mio.shared;

export async function librarySeriesItemAsync(request: express.Request, response: express.Response) {
  let metadataItemName = request.params.itemName + shared.extension.cbz + shared.extension.json;
  let metadataItemPath = shared.path.normal(request.params.providerName, request.params.seriesName, metadataItemName);
  let metadataItemExists = await fs.pathExists(metadataItemPath);
  if (metadataItemExists) {
    let metadataItem = await fs.readJson(metadataItemPath) as shared.IStoreSeriesItem;
    let result = metadataItem as mio.ILibrarySeriesItem;
    response.send(result);
  } else {
    response.sendStatus(404);
  }
}
