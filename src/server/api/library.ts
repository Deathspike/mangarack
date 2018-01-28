import * as express from 'express';

export function libraryHandler(_: express.Request, response: express.Response) {
  response.sendStatus(404);
}
