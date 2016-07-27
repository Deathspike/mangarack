import * as express from 'express';
import * as mio from '../default';

/**
 * Promise to download the series metadata.
 * @internal
 * @param request The request.
 * @param response The response.
 * @param library The library.
 * @return The promise to download the series metadata.
 */
export async function handleAsync(request: express.Request, response: express.Response, library: mio.ILibrary): Promise<void> {
  let seriesId = request.params.seriesId as number;
  let existingChapters = mio.helperService.parseBoolean(request.body.existingChapters);
  let newChapters = mio.helperService.parseBoolean(request.body.newChapters);
  if (!existingChapters.hasValue || !newChapters.hasValue) {
    response.sendStatus(400);
  } else {
    let result = await library.download(seriesId).runAsync(existingChapters.value, newChapters.value);
    if (result) {
      response.sendStatus(200);
    } else {
      response.sendStatus(404);
    }
  }
}
