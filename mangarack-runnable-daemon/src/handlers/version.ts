import * as express from 'express';
import * as mio from '../default';

/**
 * Promises the version.
 * @internal
 * @param request The request.
 * @param response The response.
 * @param library The library.
 * @return The promise for the version.
 */
export default async function(request: express.Request, response: express.Response, library: mio.ILibrary): Promise<void> {
  let result = await library.versionAsync();
  response.send(result);
}
