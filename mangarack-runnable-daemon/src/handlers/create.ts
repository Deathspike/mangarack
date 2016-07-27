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
  let seriesAddress = mio.option<string>(request.body.seriesAddress);
  if (!seriesAddress.hasValue) {
    response.sendStatus(400);
  } else {
    let result = await library.create().runAsync(seriesAddress.value);
    if (result.hasValue) {
      response.send(String(result.value));
    } else {
      response.sendStatus(404);
    }
  }
}
