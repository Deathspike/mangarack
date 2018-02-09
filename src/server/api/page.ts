import * as express from 'express';
import * as fs from 'fs-extra';
import * as mime from 'mime';
import * as mio from '../';
import * as path from 'path';
import * as unzipper from 'unzipper';
import shared = mio.shared;

export async function pageAsync(request: express.Request, response: express.Response) {
  // Initialize the downloaded chapter.
  let chapterPath = shared.path.normal(request.params.providerName, request.params.seriesTitle, request.params.chapterName + shared.extension.cbz);
  let chapterExists = await fs.pathExists(chapterPath);
  if (chapterExists) return process(request, response, chapterPath);
  
  // Initialize the deleted chapter.
  let deletedChapterPath = path.basename(chapterPath) + shared.extension.del;
  let deletedChapterExists = await fs.pathExists(deletedChapterPath);
  if (deletedChapterExists) return process(request, response, deletedChapterPath);
  response.sendStatus(404);
}

function process(request: express.Request, response: express.Response, chapterPath: string) {
  fs.createReadStream(chapterPath)
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
