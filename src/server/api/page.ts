import * as express from 'express';
import * as fs from 'fs-extra';
import * as mime from 'mime';
import * as mio from '../';
import * as unzipper from 'unzipper';
import shared = mio.shared;

export async function pageAsync(request: express.Request, response: express.Response) {
  // Initialize the downloade meta chapter.
  let metaChapterPath = shared.path.normal(request.params.providerName, request.params.seriesName, request.params.chapterName + shared.extension.cbz);
  let metaChapterExists = await fs.pathExists(metaChapterPath);
  if (metaChapterExists) return process(request, response, metaChapterPath);
  
  // Initialize the deleted meta chapter.
  let deletedmetaChapterPath = metaChapterPath + shared.extension.del;
  let deletedmetaChapterExists = await fs.pathExists(deletedmetaChapterPath);
  if (deletedmetaChapterExists) return process(request, response, deletedmetaChapterPath);
  response.sendStatus(404);
}

function process(request: express.Request, response: express.Response, filePath: string) {
  fs.createReadStream(filePath)
    .pipe(unzipper.Parse())
    .on('close', () => {
      if (response.headersSent) return;
      response.sendStatus(404);
    })
    .on('entry', (entry: unzipper.Entry) => {
      if (entry.path !== request.params.pageName) return entry.autodrain();
      response.set('Content-Type', mime.getType(entry.path) || 'application/octet-stream');
      return entry.pipe(response);
    });
}
