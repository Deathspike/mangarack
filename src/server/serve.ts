import * as express from 'express';
import * as mio from './';
import * as http from 'http';
import * as webpack from 'webpack';
import * as webpackMiddleware from 'webpack-dev-middleware';
import {html} from './web/html';
import {webpackConfig} from './webpack.config'

export async function serveAsync(port: number) {
  return new Promise<void>((resolve, reject) => {
    let app = express();
    let server = app.listen(port);
    app.set ('json spaces', 4);
    app.set ('x-powered-by', false);
    app.get ('/', baseHandler);
    app.get ('/api/library', mio.api.libraryAsync);
    app.get ('/api/library/:providerName/:seriesName', mio.api.librarySeriesAsync);
    app.get ('/api/library/:providerName/:seriesName/:seriesItemName', mio.api.librarySeriesItemAsync);
    app.get ('/api/library/:providerName/:seriesName/:seriesItemName/:fileName', mio.api.librarySeriesItemPageAsync);
    app.post('/api/quit', quitFactory(server, resolve));
    app.get ('/web', contentHandler);
    app.use (webpackFactory());
    app.use (errorFactory(server, reject));
  });
}

function baseHandler(_: express.Request, response: express.Response) {
  response.set('Location', '/web');
  response.sendStatus(301);
}

function contentHandler(_: express.Request, response: express.Response) {
  response.set('Content-Type', 'text/html');
  response.send(html);
}

function errorFactory(server: http.Server, reject: (reason: Error) => void) {
  return (error: Error, _1: express.Request, response: express.Response, _2: () => void) => {
    response.sendStatus(500);
    server.close();
    reject(error);
  };
}

function quitFactory(server: http.Server, resolve: () => void) {
  return (_: express.Request, response: express.Response) => {
    response.sendStatus(200);
    server.close();
    resolve();
  };
}

// TODO: Run when in development, NOT in production. Remember `devDependencies`.
export function webpackFactory() {
  return webpackMiddleware(webpack(webpackConfig), {
    lazy: true,
    publicPath: '/',
    stats: 'errors-only'
  });
}
