import * as express from 'express';
import * as mio from '../default';

/**
 * Promises to propagate and archive the setting.
 * @param request The request.
 * @param response The response.
 * @param library The library.
 * @return The promise to propagate and archive the setting.
 */
export default async function(request: express.Request, response: express.Response, library: mio.ILibrary): Promise<void> {
  let key = mio.option<string>(request.body.key);
  let value = mio.option<string>(request.body.value);
  if (!key.hasValue || !value.hasValue) {
    response.sendStatus(400);
  } else {
    let result = await library.setting().runAsync(key.value, value.value);
    response.send(result);
  }
}
