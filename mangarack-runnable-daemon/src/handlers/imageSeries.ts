import * as express from 'express';
import * as mio from '../default';

/**
 * Promises the series image.
 * @internal
 * @param request The request.
 * @param response The response.
 * @param library The library.
 * @return The promise for the series image.
 */
export async function handleAsync(request: express.Request, response: express.Response, library: mio.ILibrary): Promise<void> {
  let seriesId = request.params.seriesId as number;
  let result = await library.imageAsync(seriesId);
  if (result.hasValue) {
    response.set('Content-Type', mio.helperService.getContentType(result.value));
    response.send(result.value);
  } else {
    response.sendStatus(404);
  }
}
