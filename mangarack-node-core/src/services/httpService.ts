import * as mio from '../default';
import * as request from 'request';
import {ResponseType} from '../enumerators/ResponseType';
let delayInMilliseconds = 1000;
let maximumAttempts = 10;
let timeoutInMilliseconds = 5000;
let userAgent = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
type Dictionary = {[key: string]: string};

/**
 * Represents a HTTP service.
 * @internal
 */
export var httpService: mio.IHttpService = {
  /**
   * Creates a handler to retrieve the contents of the HTTP resource as a blob.
   * @param address The address, or addresses, of the HTTP resource.
   * @param headers= Each header.
   * @return The handler to retrieve the contents of the HTTP resource as a blob.
   */
  blob: function(address: string|string[], headers?: {[key: string]: string}): mio.IHttpServiceHandler<mio.IBlob> {
    return createHttpServiceHandler(ResponseType.Blob, address, headers);
  },

  /**
   * Creates a handler to retrieve the contents of the HTTP resource as a deserialized JSON object.
   * @param address The address, or addresses, of the HTTP resource.
   * @param headers= Each header.
   * @return The handler to retrieve the contents of the HTTP resource as a deserialized JSON object.
   */
  json: function<T>(address: string|string[], headers?: {[key: string]: string}): mio.IHttpServiceHandler<T> {
    return createHttpServiceHandler(ResponseType.Json, address, headers);
  },

  /**
   * Creates a handler to retrieve the contents of the HTTP resource as text.
   * @param address The address, or addresses, of the HTTP resource.
   * @param headers= Each header.
   * @return The handler to retrieve the contents of the HTTP resource as text.
   */
  text: function(address: string|string[], headers?: {[key: string]: string}): mio.IHttpServiceHandler<string> {
    return createHttpServiceHandler(ResponseType.Text, address, headers);
  }
};

/**
 * Creates an HTTP service handler.
 * @param type The request type.
 * @param address The address, or addresses, of the HTTP resource.
 * @param headers The headers.
 */
function createHttpServiceHandler<T>(type: ResponseType, address: string|string[], headers: Dictionary): mio.IHttpServiceHandler<T> {
  let addresses = Array.isArray(address) ? address : [address];
  return {
    deleteAsync: (formData?: {[key: string]: string}) => tryAsync('DELETE', type, addresses, headers, formData),
    getAsync: () => tryAsync('GET', type, addresses, headers, {}),
    patchAsync: (formData?: {[key: string]: string}) => tryAsync('PATCH', type, addresses, headers, formData),
    postAsync: (formData?: {[key: string]: string}) => tryAsync('POST', type, addresses, headers, formData),
    putAsync: (formData?: {[key: string]: string}) => tryAsync('PUT', type, addresses, headers, formData)
  };
}

/**
 * Promises to delay for the number of provided milliseconds.
 * @param delayInMilliseconds The delay in milliseconds.
 * @return The promise to delay for the number of provided milliseconds.
 */
function delayAsync(delayInMilliseconds: number): Promise<mio.IOption<void>> {
  return mio.promise<void>(callback => setTimeout(callback, delayInMilliseconds));
}

/**
 * Promises to fetch the contents of the HTTP resource.
 * @param method The method.
 * @param type The request type.
 * @param address The address of the HTTP resource.
 * @param headers Each header.
 * @param formData Each form key/value pair.
 * @return The promise for the contents of the HTTP resource.
 */
function fetchAsync<T>(method: string, type: ResponseType, address: string, headers: Dictionary, formData: Dictionary): Promise<any> {
  return new Promise((resolve, reject) => {
    headers = headers || {}; /* TODO: Should not be necessary */
    headers['User-Agent'] = headers['User-Agent'] || userAgent;
    request({
      encoding: type == ResponseType.Blob ? null : 'utf8',
      headers: headers,
      form: formData,
      gzip: true,
      jar: true,
      method: method,
      timeout: timeoutInMilliseconds,
      url: address,
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        if (type == ResponseType.Json) {
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

/**
 * Promises to try to fetch the contents of the HTTP resource
 * @param method The method.
 * @param type The request type.
 * @param addresses Each address.
 * @param headers Each header.
 * @param formData Each form key/value pair.
 * @return The promise to try to fetch the contents of the HTTP resource
 */
async function tryAsync(method: string, type: ResponseType, addresses: string[], headers: Dictionary, formData: Dictionary): Promise<any> {
  let previousError: any;
  for (let currentAttempt of Array(maximumAttempts).keys()) {
    for (let currentAddress of addresses) {
      try {
        return await fetchAsync(method, type, currentAddress, headers, formData);
      } catch (error) {
        await delayAsync(delayInMilliseconds);
        previousError = error;
      }
    }
  }
  throw new Error(previousError || `Invalid HTTP response: ${addresses.join(', ')}`);
}
