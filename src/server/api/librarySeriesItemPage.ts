import * as express from 'express';
import * as fs from 'fs-extra';
import * as mime from 'mime';
import * as mio from '../';
import * as unzip from 'unzip';
import shared = mio.shared;

// TODO: Don't forget to add image processing. Or is that going on the client?
export async function librarySeriesItemPageAsync(request: express.Request, response: express.Response) {
  let fileName = request.params.fileName;
  let seriesItemName = request.params.seriesItemName + shared.extension.cbz;
  let seriesItemPath = shared.path.normal(request.params.providerName, request.params.seriesName, seriesItemName);
  let seriesItemExists = await fs.pathExists(seriesItemPath);
  if (seriesItemExists) {
    let seriesItemStream = fs.createReadStream(seriesItemPath)
      .on('end', () => response.sendStatus(404))
      .pipe(unzip.Parse())
      .on('entry', (entry: unzip.Entry) => {
        if (entry.path !== fileName) return entry.autodrain();
        response.set('Content-Type', mime.getType(fileName) || 'application/octet-stream');
        (entry as any as fs.ReadStream)
          .on('data', chunk => response.write(chunk))
          .on('end', () => seriesItemStream.end() || response.end());
      });
  } else {
    response.sendStatus(404);
  }
}
