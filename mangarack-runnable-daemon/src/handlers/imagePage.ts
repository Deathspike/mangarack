import * as express from 'express';
import * as mio from '../default';

/**
 * Promises the page image.
 * @internal
 * @param request The request.
 * @param response The response.
 * @param library The library.
 * @return The promise for the page image.
 */
export default async function(request: express.Request, response: express.Response, library: mio.ILibrary): Promise<void> {
  let seriesId = request.params.seriesId as number;
  let chapterId = request.params.chapterId as number;
  let pageNumber = request.params.pageNumber as number;
  let result = await library.imageAsync(seriesId, chapterId, pageNumber);
  if (result.hasValue) {
    response.set('Content-Type', mio.helperService.getContentType(result.value));
    response.send(result.value);
  } else {
    response.sendStatus(404);
  }
}
