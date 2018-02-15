import * as compression from 'compression';
import * as express from 'express';
import * as mio from './';
import * as http from 'http';
import * as os from 'os';
import * as path from 'path';
const parentPath = path.resolve(__dirname, '../../../');
const publicPath = path.resolve(__dirname, '../../public');
const webpackPath = path.resolve(__dirname, '../../webpack.dev.js');

export function serveAsync(port: number, useWebpack: boolean) {
  return new Promise<void>((resolve, reject) => {
    let app = express();
    let server = app.listen(port, () => bindingOutput(port));
    app.set ('json spaces', 4);
    app.set ('strict routing', true);
    app.set ('x-powered-by', false);
    app.use (compression());
    app.get ('/api/library', async(mio.api.listAsync));
    app.get ('/api/library/:providerName/:seriesTitle', async(mio.api.seriesAsync));
    app.get ('/api/library/:providerName/:seriesTitle/:chapterName', async(mio.api.chapterAsync));
    app.get ('/api/library/:providerName/:seriesTitle/:chapterName/:pageName', async(mio.api.pageAsync));
    app.post('/api/quit', quitFactory(server, resolve));
    app.use (webpackFactory(useWebpack));
    app.use (express.static(publicPath));
    app.use (errorFactory(server, reject));
  });
}

function async(handler: express.RequestHandler) {
  return (request: express.Request, response: express.Response, next: express.NextFunction) => {
    let result = handler(request, response, next)
    if (result && result.then) {
      result.catch(next);
    }
  };
}

function bindingOutput(port: number) {
  let networkInterfaces = os.networkInterfaces();
  for (let key in networkInterfaces) {
    let items = networkInterfaces[key];
    let validItems = items.filter(item => item.family === 'IPv4');
    for (let validInterface of validItems) console.log(`Listening on ${validInterface.address}:${port}`);
  }
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

function webpackFactory(useWebpack: boolean): express.RequestHandler {
  if (!useWebpack || path.basename(parentPath) === 'node_modules') return (_1, _2, next) => next();
  let webpack = require('webpack');
  let webpackData = require(webpackPath);
  let webpackMiddleware = require('webpack-dev-middleware');
  return webpackMiddleware(webpack(webpackData), {publicPath: '/'});
}
