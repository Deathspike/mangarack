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
  let result = await library.delete(request.params.seriesId, request.params.chapterId).runAsync();
  if (result) {
    response.sendStatus(200);
  } else {
    response.sendStatus(404);
  }
}
