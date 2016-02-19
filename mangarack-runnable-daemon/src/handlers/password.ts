import * as express from 'express';
import * as mio from '../default';

/**
 * Promises to set the password.
 * @param request The request.
 * @param response The response.
 * @param library The library.
 * @return The promise to set the password.
 */
export default async function(request: express.Request, response: express.Response, library: mio.ILibrary): Promise<void> {
  let password = mio.option<string>(request.body.password);
  if (!password.hasValue) {
    response.sendStatus(400);
  } else {
    await library.password().runAsync(password.value);
    response.sendStatus(200);
  }
}
