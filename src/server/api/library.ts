import * as express from 'express';
import * as fs from 'fs-extra';
import * as mio from '../';
import * as sanitizeFilename from 'sanitize-filename';
import shared = mio.shared;

export async function libraryAsync(_: express.Request, response: express.Response) {
  let results = [] as shared.ILibraryProvider;
  for (let providerName of shared.settings.providerNames) {
    let metadataPath = shared.path.normal(providerName + shared.extension.json);
    let metadataExists = await fs.pathExists(metadataPath);
    let metadata = metadataExists ? await fs.readJson(metadataPath) as shared.IStoreProvider : {};
    for (let url in metadata) {
      results.push({
        displayName: metadata[url],
        providerName: providerName,
        seriesName: sanitizeFilename(metadata[url])
      });
    }
  }
  response.send(results);
}
