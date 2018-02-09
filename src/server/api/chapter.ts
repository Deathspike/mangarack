import * as express from 'express';
import * as fs from 'fs-extra';
import * as mio from '../';
import * as unzipper from 'unzipper';
import shared = mio.shared;

export async function chapterAsync(request: express.Request, response: express.Response) {
  // Initialize the downloaded chapter.
  let chapterPath = shared.path.normal(request.params.providerName, request.params.seriesTitle, request.params.chapterName + shared.extension.cbz);
  let chapterExists = await fs.pathExists(chapterPath);
  if (chapterExists) return process(response, chapterPath);
  
  // Initialize the deleted chapter.
  let deletedChapterPath = shared.path.normal(request.params.providerName, request.params.seriesTitle, request.params.chapterName + shared.extension.del);
  let deletedChapterExists = await fs.pathExists(deletedChapterPath);
  if (deletedChapterExists) return process(response, deletedChapterPath);
  response.sendStatus(404);
}

function process(response: express.Response, filePath: string) {
  let chapterPages = [] as shared.IApiChapter;
  fs.createReadStream(filePath)
    .pipe(unzipper.Parse())
    .on('close', () => response.send(chapterPages))
    .on('entry', (entry: unzipper.Entry) => {
      chapterPages.push(entry.path);
      entry.autodrain();
    });
}
