import * as express from 'express';
import * as mio from '../default';

/**
 * Promises the list of chapters.
 * @internal
 * @param request The request.
 * @param response The response.
 * @param library The library.
 * @return The promise for the list of chapters.
 */
export default async function(request: express.Request, response: express.Response, library: mio.ILibrary): Promise<void> {
  let seriesId = request.params.seriesId as number;
  let result = await library.listAsync(seriesId);
  if (result.hasValue) {
    response.send(result.value);
  } else {
    response.sendStatus(404);
  }
}
