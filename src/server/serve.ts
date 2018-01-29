import * as express from 'express';
import * as mio from './';
import * as http from 'http';
import * as path from 'path';
const parentPath = path.resolve(__dirname, '../../../');
const publicPath = path.resolve(__dirname, '../../public');
const webpackPath = path.resolve(__dirname, '../../webpack.dev.js');

export async function serveAsync(port: number) {
  return new Promise<void>((resolve, reject) => {
    let app = express();
    let server = app.listen(port);
    app.use (webpackFactory());
    app.set ('json spaces', 4);
    app.set ('strict routing', true);
    app.set ('x-powered-by', false);
    app.get ('/', express.static(publicPath));
    app.get ('/api/library', mio.api.libraryAsync);
    app.get ('/api/library/:providerName/:seriesName', mio.api.librarySeriesAsync);
    app.get ('/api/library/:providerName/:seriesName/:seriesItemName', mio.api.librarySeriesItemAsync);
    app.get ('/api/library/:providerName/:seriesName/:seriesItemName/:fileName', mio.api.librarySeriesItemPageAsync);
    app.post('/api/quit', quitFactory(server, resolve));
    app.use (errorFactory(server, reject));
  });
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

function webpackFactory(): express.RequestHandler {
  if (path.basename(parentPath) === 'node_modules') return (_1, _2, next) => next();
  let webpack = require('webpack');
  let webpackData = require(webpackPath);
  let webpackMiddleware = require('webpack-dev-middleware');
  return webpackMiddleware(webpack(webpackData), {publicPath: '/'});
}
