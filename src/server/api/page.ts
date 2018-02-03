import * as express from 'express';
import * as fs from 'fs-extra';
import * as mime from 'mime';
import * as mio from '../';
import * as unzipper from 'unzipper';
import shared = mio.shared;

export async function pageAsync(request: express.Request, response: express.Response) {
  let metaChapterName = request.params.chapterName + shared.extension.cbz;
  let metaChapterPath = shared.path.normal(request.params.providerName, request.params.seriesName, metaChapterName);
  let metaChapterExists = await fs.pathExists(metaChapterPath);
  if (metaChapterExists) {
    fs.createReadStream(metaChapterPath)
      .pipe(unzipper.Parse())
      .on('close', () => close(response))
      .on('entry', (entry: unzipper.Entry) => process(request, response, entry));
  } else {
    response.sendStatus(404);
  }
}

function close(response: express.Response) {
  if (!response.headersSent) {
    response.sendStatus(404);
  }
}

function process(request: express.Request, response: express.Response, entry: unzipper.Entry) {
  if (entry.path === request.params.pageName) {
    response.set('Content-Type', mime.getType(request.params.pageName) || 'application/octet-stream');
    entry.pipe(response);
  } else {
    entry.autodrain();
  }
}
