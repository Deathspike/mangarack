import * as bluebird from 'bluebird';
import * as client from './client/';
(window as any).Promise = bluebird.Promise;

window.addEventListener('unhandledrejection', (e: any) => {
  e.preventDefault();
  client.processError(e.detail.reason);
});

window.addEventListener('error', (e) => {
  e.preventDefault();
  client.processError(e);
});

client.processStart();
