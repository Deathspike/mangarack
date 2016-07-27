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
export async function handleAsync(request: express.Request, response: express.Response, library: mio.ILibrary): Promise<void> {
  let seriesId = request.params.seriesId as number;
  let removeMetadata = mio.helperService.parseBoolean(request.body.removeMetadata);
  if (!removeMetadata.hasValue) {
    response.sendStatus(400);
  } else {
    let result = await library.delete(seriesId).runAsync(removeMetadata.value);
    if (result) {
      response.sendStatus(200);
    } else {
      response.sendStatus(404);
    }
  }
}
