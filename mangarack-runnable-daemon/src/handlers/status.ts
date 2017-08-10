import * as express from 'express';
import * as mio from '../default';

/**
 * Promises to set the number of read pages status.
 * @internal
 * @param request The request.
 * @param response The response.
 * @param library The library.
 * @return The promise to set the number of read pages status.
 */
export async function handleAsync(request: express.Request, response: express.Response, library: mio.ILibrary): Promise<void> {
  let numberOfReadPages = parseInt(request.body.numberOfReadPages, 10);
  if (isFinite(numberOfReadPages)) {
    let result = await library.status(request.params.seriesId, request.params.chapterId).runAsync(numberOfReadPages);
    if (result) {
      response.sendStatus(200);
    } else {
      response.sendStatus(404);
    }
  } else {
    response.sendStatus(400);
  }
}
