import * as mio from '../default';
import * as request from 'request';
import {ActiveType} from './enumerators/ActiveType';
const delayInMilliseconds = [1000, 2500];
const maximumNumberOfRetries = 5;
const timeoutInMilliseconds = [15000, 30000];
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
  let maximumNumberOfAttempts = getNumberOfAttempts(controlType);
  let previousError: any;
  for (let currentAttempt = 0; currentAttempt < maximumNumberOfAttempts; currentAttempt++) {
    for (let currentAddress of addresses) {
      try {
        return await fetchAsync(activeMethod, activeType, currentAddress, controlType, formData, headers);
      } catch (error) {
        previousError = error;
        await mio.promise<void>(callback => setTimeout(callback, getRandomBetweenBoundaries(delayInMilliseconds)));
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
  headers = headers || {};
  headers['User-Agent'] = headers['User-Agent'] || userAgent;
  return new Promise((resolve, reject) => {
    let timeout = getTimeoutInMilliseconds(controlType);
    let encoding: any = activeType === ActiveType.Blob ? null : 'utf8';
    let data = {encoding, form: formData, gzip: true, headers, jar: true, method: activeMethod, timeout, url: address};
    request(data, (error, response, body) => {
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
          statusCode: response.statusCode || 0
        }, `Invalid HTTP response: ${address}`));
      }
    });
  });
}

/**
 * Retrieves the number of attempts.
 * @param controlType= The control type.
 * @return The number of attempts.
 */
function getNumberOfAttempts(controlType?: mio.ControlType): number {
  if (controlType === mio.ControlType.BasicWithRetry || controlType === mio.ControlType.TimeoutWithRetry) {
    return maximumNumberOfRetries;
  } else {
    return 1;
  }
}

/**
 * Retrieves a random value between the boundaries.
 * @param boundaries The boundaries.
 * @return The random value.
 */
function getRandomBetweenBoundaries(boundaries: number[]): number {
  return Math.floor(Math.random() * (boundaries[1] - boundaries[0] + 1)) + boundaries[0];
}

/**
 * Retrieves the timeout in milliseconds.
 * @param controlType= The control type.
 * @return The timeout in milliseconds.
 */
function getTimeoutInMilliseconds(controlType?: mio.ControlType): number {
  if (controlType === mio.ControlType.Timeout || controlType === mio.ControlType.TimeoutWithRetry) {
    return getRandomBetweenBoundaries(timeoutInMilliseconds);
  } else {
    return 0;
  }
}
