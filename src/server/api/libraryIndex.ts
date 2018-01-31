import * as express from 'express';
import * as fs from 'fs-extra';
import * as mio from '../';
import * as path from 'path';
import * as sanitizeFilename from 'sanitize-filename';
import shared = mio.shared;

export async function libraryIndexAsync(_: express.Request, response: express.Response) {
  let fileNames = await fs.readdir(shared.path.normal());
  let libraryIndex = [] as shared.ILibraryIndex;
  for (let fileName of fileNames) {
    let fileExtension = path.extname(fileName);
    if (fileExtension === shared.extension.json) {
      let metadataProviderPath = shared.path.normal(fileName);
      let metadataProvider = await fs.readJson(metadataProviderPath) as shared.IMetadataProvider;
      let providerName = fileName.substr(0, fileName.length - fileExtension.length);
      for (let url in metadataProvider) {
        libraryIndex.push({
          displayName: metadataProvider[url],
          providerName: providerName,
          seriesName: sanitizeFilename(metadataProvider[url])
        });
      }
    }
  }
  response.send(libraryIndex);
}
