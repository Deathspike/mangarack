import * as express from 'express';
import * as fs from 'fs-extra';
import * as mio from '../';
import shared = mio.shared;

export async function libraryChapterAsync(request: express.Request, response: express.Response) {
  let metadataChapterName = request.params.chapterName + shared.extension.cbz + shared.extension.json;
  let metadataChapterPath = shared.path.normal(request.params.providerName, request.params.seriesName, metadataChapterName);
  let metadataChapterExists = await fs.pathExists(metadataChapterPath);
  if (metadataChapterExists) {
    let metadataChapter = await fs.readJson(metadataChapterPath) as shared.IMetadataChapter;
    let libraryChapter = metadataChapter as shared.ILibraryChapter;
    response.send(libraryChapter);
  } else {
    response.sendStatus(404);
  }
}
