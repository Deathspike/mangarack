import * as express from 'express';
import * as mio from '../default';

/**
 * Promises to delete the series.
 * @internal
 * @param request The request.
 * @param response The response.
 * @param library The library.
 * @return The promise to delete the series.
 */
export default async function(request: express.Request, response: express.Response, library: mio.ILibrary): Promise<void> {
  let seriesId = request.params.seriesId as number;
  let result = await library.deleteAsync(seriesId);
  if (result) {
    response.sendStatus(200);
  } else {
    response.sendStatus(404);
  }
}
