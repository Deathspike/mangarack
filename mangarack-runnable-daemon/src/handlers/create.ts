import * as express from 'express';
import * as mio from '../default';

/**
 * Promises to create the series.
 * @internal
 * @param request The request.
 * @param response The response.
 * @param library The library.
 * @return The promise to create the series.
 */
export async function handleAsync(request: express.Request, response: express.Response, library: mio.ILibrary): Promise<void> {
  let seriesAddress = request.body.seriesAddress;
  if (!seriesAddress) {
    response.sendStatus(400);
  } else {
    let result = await library.create().runAsync(seriesAddress.value);
    if (isFinite(result)) {
      response.send(String(result));
    } else {
      response.sendStatus(404);
    }
  }
}
