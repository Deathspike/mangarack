import * as express from 'express';
import * as fs from 'fs-extra';
import * as mio from '../';
import * as path from 'path';
import * as sanitizeFilename from 'sanitize-filename';
import shared = mio.shared;

export async function indexAsync(_: express.Request, response: express.Response) {
  let apiIndex = [] as shared.IApiIndex;
  let fileNames = await fs.readdir(shared.path.normal());
  for (let fileName of fileNames) {
    let fileExtension = path.extname(fileName);
    if (fileExtension === shared.extension.json) {
      let metaProviderPath = shared.path.normal(fileName);
      let metaProvider = await fs.readJson(metaProviderPath) as shared.IMetaProvider;
      let providerName = fileName.substr(0, fileName.length - fileExtension.length);
      for (let url in metaProvider) {
        apiIndex.push({
          providerName: providerName,
          seriesName: sanitizeFilename(metaProvider[url]),
          seriesTitle: metaProvider[url]
        });
      }
    }
  }
  response.send(apiIndex);
}
