import * as express from 'express';
import * as fs from 'fs-extra';
import * as mio from '../';
import * as unzipper from 'unzipper';
import shared = mio.shared;

export async function chapterAsync(request: express.Request, response: express.Response) {
  let chapterName = request.params.chapterName + shared.extension.cbz;
  let chapterPath = shared.path.normal(request.params.providerName, request.params.seriesTitle, chapterName);
  let chapterExists = await fs.pathExists(chapterPath);
  if (chapterExists) {
    let chapter: shared.IApiChapter = {
      name: request.params.chapterName,
      pageNames: []
    };
    fs.createReadStream(chapterPath)
      .pipe(unzipper.Parse())
      .on('close', () => response.send(chapter))
      .on('entry', (entry: unzipper.Entry) => {
        chapter.pageNames.push(entry.path);
        entry.autodrain();
      });
  } else {
    response.sendStatus(404);
  }
}
