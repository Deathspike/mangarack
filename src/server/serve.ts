import * as express from 'express';
import * as mio from './';
import * as http from 'http';

export async function serveAsync(port: number) {
  return new Promise<void>((resolve, reject) => {
    let app = express();
    let server = app.listen(port);
    app.set ('json spaces', 4);
    app.set ('x-powered-by', false);
    app.get ('/api/library', mio.api.libraryHandlerAsync);
    app.post('/api/quit', quitHandlerFactory(server, resolve));
    app.use (errorHandlerFactory(server, reject));
  });
}

function errorHandlerFactory(server: http.Server, reject: (reason: any) => void) {
  return (error: Error, _1: express.Request, response: express.Response, _2: () => void) => {
    response.sendStatus(500);
    server.close();
    reject(error);
  };
}

function quitHandlerFactory(server: http.Server, resolve: () => void) {
  return (_: express.Request, response: express.Response) => {
    response.sendStatus(200);
    server.close();
    resolve();
  };
}
