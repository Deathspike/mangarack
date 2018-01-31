import * as express from 'express';
import * as fs from 'fs-extra';
import * as mime from 'mime';
import * as mio from '../';
import * as unzip from 'unzip';
import shared = mio.shared;

// TODO: Don't forget to add image processing. Or is that going on the client?
export async function libraryPageAsync(request: express.Request, response: express.Response) {
  let metadataChapterName = request.params.chapterName + shared.extension.cbz;
  let metadataChapterPath = shared.path.normal(request.params.providerName, request.params.seriesName, metadataChapterName);
  let metadataChapterExists = await fs.pathExists(metadataChapterPath);
  if (metadataChapterExists) {
    let chapterStream = fs.createReadStream(metadataChapterPath)
      .on('end', () => response.sendStatus(404))
      .pipe(unzip.Parse())
      .on('entry', (entry: unzip.Entry) => {
        if (entry.path !== request.params.pageName) return entry.autodrain();
        response.set('Content-Type', mime.getType(request.params.pageName) || 'application/octet-stream');
        (entry as any as fs.ReadStream)
          .on('data', chunk => response.write(chunk))
          .on('end', () => chapterStream.end() || response.end());
      });
  } else {
    response.sendStatus(404);
  }
}
