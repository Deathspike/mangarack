import * as express from 'express';
import * as mio from '../default';

/**
 * Promises to delete the chapter.
 * @internal
 * @param request The request.
 * @param response The response.
 * @param library The library.
 * @return The promise to delete the chapter.
 */
export async function handleAsync(request: express.Request, response: express.Response, library: mio.ILibrary): Promise<void> {
  let seriesId = request.params.seriesId as number;
  let chapterId = request.params.chapterId as number;
  let result = await library.delete(seriesId, chapterId).runAsync();
  if (result) {
    response.sendStatus(200);
  } else {
    response.sendStatus(404);
  }
}
