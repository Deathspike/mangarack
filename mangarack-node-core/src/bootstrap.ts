import * as mio from 'mangarack-component-core';
import {htmlService} from './services/htmlService';
import {httpService} from './services/httpService';
import {storeService} from './services/storeService';
mio.dependency.set('IHtmlService', htmlService);
mio.dependency.set('IHttpService', httpService);
mio.dependency.set('IStoreService', storeService);
