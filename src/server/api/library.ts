import * as express from 'express';
import * as fs from 'fs-extra';
import * as mio from '../';
import * as sanitizeFilename from 'sanitize-filename';
import shared = mio.shared;

export async function libraryHandlerAsync(_: express.Request, response: express.Response) {
  let results: mio.ILibraryProvider = [];
  for (let providerName of shared.settings.providerNames) {
    let providerPath = shared.path.normal(providerName + shared.extension.json);
    let providerExists = await fs.pathExists(providerPath);
    let provider = providerExists ? await fs.readJson(providerPath) as shared.IStoreProvider : {};
    for (let url in provider) {
      results.push({
        displayName: provider[url],
        providerName: providerName,
        seriesName: sanitizeFilename(provider[url])
      });
    }
  }
  response.send(results);
}
