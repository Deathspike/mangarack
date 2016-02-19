import * as basicAuth from 'basic-auth';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as express from 'express';
import * as mio from './default';
import * as path from 'path';

/**
 * Starts the HTTP server.
 */
export function startHttp() {
  let app = express();
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  serveStatic(app);

  // Register parameter validation.
  app.param('seriesId', createValidation('seriesId'));
  app.param('chapterId', createValidation('chapterId'));
  app.param('pageNumber', createValidation('pageNumber'));

  // Register route handlers.
  app.get   ('/content/:seriesId', createHandler(require('./handlers/imageSeries')));
  app.get   ('/content/:seriesId/:chapterId/:pageNumber', createHandler(require('./handlers/imagePage')));
  app.get   ('/api', createHandler(require('./handlers/version')));
  app.post  ('/api', createHandler(require('./handlers/password')));
  app.post  ('/api/download', createHandler(require('./handlers/download')));
  app.post  ('/api/download/:seriesId', createHandler(require('./handlers/downloadSeries')));
  app.post  ('/api/download/:seriesId/:chapterId', createHandler(require('./handlers/downloadChapter')));
  app.get   ('/api/library', createHandler(require('./handlers/listSeries')));
  app.post  ('/api/library', createHandler(require('./handlers/create')));
  app.delete('/api/library/:seriesId', createHandler(require('./handlers/deleteSeries')));
  app.get   ('/api/library/:seriesId', createHandler(require('./handlers/listChapters')));
  app.delete('/api/library/:seriesId/:chapterId', createHandler(require('./handlers/deleteChapter')));
  app.patch ('/api/library/:seriesId/:chapterId', createHandler(require('./handlers/status')));
  app.patch ('/api/setting', createHandler(require('./handlers/setting')));

  // Listen for requests.
  app.listen(7782);
}

/**
 * Creates an authenticated library handler.
 * @param handler The handler.
 * @return The authenticated library handler.
 */
function createHandler(handler: any): any {
  return async function(request: express.Request, response: express.Response): Promise<void> {
    try {
      var authentication = basicAuth(request);
      let library = await mio.openLibraryAsync(mio.option(authentication ? authentication.pass : ''));
      if (library.hasValue) {
        await handler.default(request, response, library.value);
      } else {
        response.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        response.sendStatus(401);
      };
    } catch(error) {
      console.log(error.stack || error);
    } finally {
      if (!response.headersSent) {
        response.sendStatus(500);
      }
    }
  };
}

/**
 * Creates the validation handler for the parameter.
 * @param parameterName The parameter name.
 * @return The validation handler for the parameter.
 */
function createValidation(parameterName: string): any {
  return function(request: express.Request, response: express.Response, next: () => void) {
    request.params[parameterName] = parseInt(request.params[parameterName], 10);
    if (isFinite(request.params[parameterName])) {
      next();
    } else {
      response.sendStatus(404);
    }
  };
}

/**
 * Serves static files according to the current environment.
 * @param app The application.
 */
function serveStatic(app: express.Application): void {
  if ((process as any).isBundled) {
    app.use(express.static(path.join(process.argv[1], '../public')));
  } else {
    app.use(express.static(path.join(__dirname, '../../mangarack-component-web/dist')));
    app.use(express.static(path.join(__dirname, '../../mangarack-component-web/public')));
  }
}
