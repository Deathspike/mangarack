import * as express from 'express';
import * as mio from '../default';

/**
 * Promises to propagate and archive the setting.
 * @internal
 * @param request The request.
 * @param response The response.
 * @param library The library.
 * @return The promise to propagate and archive the setting.
 */
export async function handleAsync(request: express.Request, response: express.Response, library: mio.ILibrary): Promise<void> {
  let key = request.body.key;
  let value = request.body.value;
  if (!key || !value) {
    response.sendStatus(400);
  } else {
    await library.setting().runAsync(key, value);
    response.sendStatus(200);
  }
}
