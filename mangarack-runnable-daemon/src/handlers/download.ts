import * as express from 'express';
import * as mio from '../default';

/**
 * Promises to download each series metadata.
 * @internal
 * @param request The request.
 * @param response The response.
 * @param library The library.
 * @return The promise to download each series metadata.
 */
export async function handleAsync(request: express.Request, response: express.Response, library: mio.ILibrary): Promise<void> {
  let existingChapters = mio.helperService.parseBoolean(request.body.existingChapters);
  let newChapters = mio.helperService.parseBoolean(request.body.newChapters);
  if (!existingChapters.hasValue || !newChapters.hasValue) {
    response.sendStatus(400);
  } else {
    await library.download().runAsync(existingChapters.value, newChapters.value);
    response.sendStatus(200);
  }
}
