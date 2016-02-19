import * as basicAuth from 'basic-auth';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as express from 'express';
import * as mio from './default';
let storeService = mio.dependency.get<mio.IStoreService>('IStoreService');

/**
 * Starts the HTTP server.
 */
export function startHttp() {
  let app = express();
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  // Register parameter validation.
  app.param('seriesId', createValidation('seriesId'));
  app.param('chapterId', createValidation('chapterId'));
  app.param('pageNumber', createValidation('pageNumber'));

  // Register route handlers.
  app.get   ('/content/:seriesId', createHandler('imageSeries'));
  app.get   ('/content/:seriesId/:chapterId/:pageNumber', createHandler('imagePage'));
  app.get   ('/api', createHandler('version'));
  app.post  ('/api', createHandler('password'));
  app.post  ('/api/download', createHandler('download'));
  app.post  ('/api/download/:seriesId', createHandler('downloadSeries'));
  app.post  ('/api/download/:seriesId/:chapterId', createHandler('downloadChapter'));
  app.get   ('/api/library', createHandler('listSeries'));
  app.post  ('/api/library', createHandler('create'));
  app.delete('/api/library/:seriesId', createHandler('deleteSeries'));
  app.get   ('/api/library/:seriesId', createHandler('listChapters'));
  app.delete('/api/library/:seriesId/:chapterId', createHandler('deleteChapter'));
  app.patch ('/api/library/:seriesId/:chapterId', createHandler('status'));

  // Listen for requests.
  app.listen(7782);
}

/**
 * Creates an authenticated library handler.
 * @param id The identifier.
 * @return The authenticated library handler.
 */
function createHandler(id: string): any {
  let boundFunction = require(`./handlers/${id}`).default;
  return async function(request: express.Request, response: express.Response): Promise<void> {
    try {
      var authentication = basicAuth(request);
      let library = await mio.openLibraryAsync(mio.option(authentication ? authentication.pass : ''));
      if (library.hasValue) {
        await boundFunction(request, response, library.value);
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
