import * as express from 'express';
import * as fs from 'fs-extra';
import * as mio from '../';
import shared = mio.shared;

export async function chapterAsync(request: express.Request, response: express.Response) {
  let metaChapterName = request.params.chapterName + shared.extension.cbz + shared.extension.json;
  let metaChapterPath = shared.path.normal(request.params.providerName, request.params.seriesName, metaChapterName);
  let metaChapterExists = await fs.pathExists(metaChapterPath);
  if (metaChapterExists) {
    let metaChapter = await fs.readJson(metaChapterPath) as shared.IMetaChapter;
    let apiChapter = metaChapter as shared.IApiChapter;
    response.send(apiChapter);
  } else {
    response.sendStatus(404);
  }
}
