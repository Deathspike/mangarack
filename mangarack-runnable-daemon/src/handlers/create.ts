import * as express from 'express';
import * as mio from '../default';

/**
 * Promises to create the series.
 * @param request The request.
 * @param response The response.
 * @param library The library.
 * @return The promise to create the series.
 */
export default async function(request: express.Request, response: express.Response, library: mio.ILibrary): Promise<void> {
  let seriesAddress = mio.option<string>(request.body.seriesAddress);
  if (!seriesAddress.hasValue || !isValid(seriesAddress.value)) {
    response.sendStatus(400);
  } else {
    let result = await library.create().runAsync(seriesAddress.value);
    response.send(result);
  }
}

/**
 * Determines whether the series address is valid.
 * @param seriesAddress The series address.
 * @return Indicates whether the series address is valid.
 */
function isValid(seriesAddress: string): boolean {
  try {
    mio.openProvider(seriesAddress);
    return true;
  } catch (error) {
    return false;
  }
}
