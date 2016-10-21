/* tslint:disable:no-null-keyword */
import * as mio from '../default';
import * as request from 'request';
import {ActiveType} from './enumerators/ActiveType';
const delayInMilliseconds = 2000;
const maximumRetries = 5;
const timeoutInMilliseconds = 30000;
const userAgent = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

/**
 * Represents a HTTP service.
 * @internal
 */
export let httpService: mio.IHttpService = {
  /**
   * Creates a handler to retrieve the contents of the HTTP resource as a blob.
   * @param address The address, or addresses.
   * @param controlType= The control type.
   * @param headers= Each header.
   * @return The handler to retrieve the contents of the HTTP resource as a blob.
   */
  blob: function(address: string | string[], controlType?: mio.ControlType, headers?: mio.IDictionary): mio.IHttpServiceHandler<mio.IBlob> {
    return createHandler(ActiveType.Blob, address, controlType, headers);
  },

  /**
   * Creates a handler to retrieve the contents of the HTTP resource as a deserialized JSON object.
   * @param address The address, or addresses.
   * @param controlType= The control type.
   * @param headers= Each header.
   * @return The handler to retrieve the contents of the HTTP resource as a deserialized JSON object.
   */
  json: function<T>(address: string | string[], controlType?: mio.ControlType, headers?: mio.IDictionary): mio.IHttpServiceHandler<T> {
    return createHandler(ActiveType.Json, address, controlType, headers);
  },

  /**
   * Creates a handler to retrieve the contents of the HTTP resource as text.
   * @param address The address, or addresses.
   * @param controlType= The control type.
   * @param headers= Each header.
   * @return The handler to retrieve the contents of the HTTP resource as text.
   */
  text: function(address: string | string[], controlType?: mio.ControlType, headers?: mio.IDictionary): mio.IHttpServiceHandler<string> {
    return createHandler(ActiveType.Text, address, controlType, headers);
  }
};

/**
 * Creates a service handler.
 * @param activeType The active type.
 * @param address The address, or addresses.
 * @param controlType= The control type.
 * @param headers= The headers.
 * @return The service handler.
 */
function createHandler<T>(activeType: ActiveType, address: string | string[], controlType?: mio.ControlType, headers?: mio.IDictionary): mio.IHttpServiceHandler<T> {
  return {
    deleteAsync: (formData) => fetchAnyAsync('DELETE', activeType, address, controlType, formData, headers),
    getAsync: () => fetchAnyAsync('GET', activeType, address, controlType, {}, headers),
    patchAsync: (formData) => fetchAnyAsync('PATCH', activeType, address, controlType, formData, headers),
    postAsync: (formData) => fetchAnyAsync('POST', activeType, address, controlType, formData, headers),
    putAsync: (formData) => fetchAnyAsync('PUT', activeType, address, controlType, formData, headers)
  };
}

/**
 * Promises to try to fetch the contents of the HTTP resource
 * @param activeMethod The active method.
 * @param activeType The active type.
 * @param address The address, or addresses.
 * @param controlType= The control type.
 * @param formData= The form data.
 * @param headers= The headers.
 * @return The promise to try to fetch the contents of the HTTP resource
 */
async function fetchAnyAsync(activeMethod: string, activeType: ActiveType, address: string | string[], controlType?: mio.ControlType, formData?: mio.IDictionary, headers?: mio.IDictionary): Promise<any> {
  let addresses = Array.isArray(address) ? address : [address];
  let maximumAttempts = controlType === mio.ControlType.BasicWithRetry || controlType === mio.ControlType.TimeoutWithRetry ? maximumRetries : 1;
  let previousError: any;
  for (let currentAttempt = 0; currentAttempt < maximumAttempts; currentAttempt++) {
    for (let currentAddress of addresses) {
      try {
        return await fetchAsync(activeMethod, activeType, currentAddress, controlType, formData, headers);
      } catch (error) {
        previousError = error;
        await mio.promise<void>(callback => setTimeout(callback, delayInMilliseconds));
      }
    }
  }
  if (previousError) {
    throw previousError;
  } else {
    throw new Error(`Invalid HTTP response: ${addresses.join(', ')}`);
  }
}

/**
 * Promises to try to fetch the contents of the HTTP resource
 * @param activeMethod The active method.
 * @param activeType The active type.
 * @param address The address.
 * @param controlType= The control type.
 * @param formData= The form data.
 * @param headers= The headers.
 * @return The promise to try to fetch the contents of the HTTP resource
 */
async function fetchAsync(activeMethod: string, activeType: ActiveType, address: string, controlType?: mio.ControlType, formData?: mio.IDictionary, headers?: mio.IDictionary): Promise<any> {
  controlType = controlType || mio.ControlType.Basic;
  formData = formData || {};
  headers = headers || {};
  headers['User-Agent'] = headers['User-Agent'] || userAgent;
  return new Promise((resolve, reject) => {
    let timeout = controlType < mio.ControlType.Timeout ? 0 : timeoutInMilliseconds;
    let encoding: any = activeType === ActiveType.Blob ? null : 'utf8';
    let core = {encoding: encoding, form: formData, gzip: true, headers: headers, jar: true, method: activeMethod, timeout: timeout, url: address};
    request(core, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        if (activeType === ActiveType.Json) {
          // TODO: This parse can throw an error, which is not caught.
          resolve(JSON.parse(body));
        } else {
          resolve(body);
        }
      } else {
        reject(new mio.HttpServiceError({
          body: String(body || ''),
          statusCode: (response ? response.statusCode : 0) || 0
        }, `Invalid HTTP response: ${address}`));
      }
    });
  });
}
