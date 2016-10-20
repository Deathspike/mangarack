import * as express from 'express';
import * as mio from '../default';

/**
 * Promises to set the password.
 * @internal
 * @param request The request.
 * @param response The response.
 * @param library The library.
 * @return The promise to set the password.
 */
export async function handleAsync(request: express.Request, response: express.Response, library: mio.ILibrary): Promise<void> {
  let password = request.body.password;
  if (typeof password === 'string') {
    await library.password().runAsync(password);
    response.sendStatus(200);
  } else {
    response.sendStatus(400);
  }
}
