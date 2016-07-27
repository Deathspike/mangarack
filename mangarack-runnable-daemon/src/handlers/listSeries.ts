import * as express from 'express';
import * as mio from '../default';

/**
 * Promises the list of series.
 * @internal
 * @param request The request.
 * @param response The response.
 * @param library The library.
 * @return The promise for the list of series.
 */
export async function handleAsync(request: express.Request, response: express.Response, library: mio.ILibrary): Promise<void> {
  let result = await library.listAsync();
  response.send(result);
}
