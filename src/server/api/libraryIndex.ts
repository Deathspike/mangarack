import * as express from 'express';
import * as fs from 'fs-extra';
import * as mio from '../';
import * as sanitizeFilename from 'sanitize-filename';
import shared = mio.shared;

export async function libraryIndexAsync(_: express.Request, response: express.Response) {
  let libraryIndex = [] as shared.ILibraryIndex;
  for (let providerName of shared.settings.providerNames) {
    let metadataProviderPath = shared.path.normal(providerName + shared.extension.json);
    let metadataProviderExists = await fs.pathExists(metadataProviderPath);
    let metadataProvider = metadataProviderExists ? await fs.readJson(metadataProviderPath) as shared.IMetadataProvider : {};
    for (let url in metadataProvider) {
      libraryIndex.push({
        displayName: metadataProvider[url],
        providerName: providerName,
        seriesName: sanitizeFilename(metadataProvider[url])
      });
    }
  }
  response.send(libraryIndex);
}
