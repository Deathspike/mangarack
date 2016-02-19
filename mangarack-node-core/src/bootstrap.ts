import * as mio from 'mangarack-component-core';
import {htmlService} from './services/htmlService';
import {httpService} from './services/httpService';
mio.dependency.set('IHtmlService', htmlService);
mio.dependency.set('IHttpService', httpService);
