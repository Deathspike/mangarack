import * as mio from '../default';
import * as request from 'request';
import {ResponseType} from './enumerators/ResponseType';
let delayInMilliseconds = 2000;
let maximumAttempts = 5;
let timeoutInMilliseconds = 30000;
let userAgent = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

/**
 * Represents a HTTP service.
 * @internal
 */
export let httpService: mio.IHttpService = {
  /**
   * Creates a handler to retrieve the contents of the HTTP resource as a blob.
   * @param address The address, or addresses.
   * @param headers Each header.
   * @param requestType The request type.
   * @return The handler to retrieve the contents of the HTTP resource as a blob.
   */
  blob: function(address: string | string[], headers: mio.IDictionary, requestType: mio.RequestType): mio.IHttpServiceHandler<mio.IBlob> {
    let addresses = Array.isArray(address) ? address : [address];
    return createHandler(ResponseType.Blob, addresses, headers, requestType);
  },

  /**
   * Creates a handler to retrieve the contents of the HTTP resource as a deserialized JSON object.
   * @param address The address, or addresses.
   * @param headers Each header.
   * @param requestType The request type.
   * @return The handler to retrieve the contents of the HTTP resource as a deserialized JSON object.
   */
  json: function<T>(address: string | string[], headers: mio.IDictionary, requestType: mio.RequestType): mio.IHttpServiceHandler<T> {
    let addresses = Array.isArray(address) ? address : [address];
    return createHandler(ResponseType.Json, addresses, headers, requestType);
  },

  /**
   * Creates a handler to retrieve the contents of the HTTP resource as text.
   * @param address The address, or addresses.
   * @param headers Each header.
   * @param requestType The request type.
   * @return The handler to retrieve the contents of the HTTP resource as text.
   */
  text: function(address: string | string[], headers: mio.IDictionary, requestType: mio.RequestType): mio.IHttpServiceHandler<string> {
    let addresses = Array.isArray(address) ? address : [address];
    return createHandler(ResponseType.Text, addresses, headers, requestType);
  }
};

/**
 * Creates a service handler.
 * @param type The response type.
 * @param addresses The addresses.
 * @param headers The headers.
 * @param requestType The request type.
 * @return The service handler.
 */
function createHandler<T>(type: ResponseType, addresses: string[], headers: mio.IDictionary, requestType: mio.RequestType): mio.IHttpServiceHandler<T> {
  return {
    deleteAsync: formData => fetchAnyAsync('DELETE', type, addresses, headers, requestType, formData),
    getAsync: () => fetchAnyAsync('GET', type, addresses, headers, requestType, {}),
    patchAsync: formData => fetchAnyAsync('PATCH', type, addresses, headers, requestType, formData),
    postAsync: formData => fetchAnyAsync('POST', type, addresses, headers, requestType, formData),
    putAsync: formData => fetchAnyAsync('PUT', type, addresses, headers, requestType, formData)
  };
}

/**
 * Promises to delay for the number of provided milliseconds.
 * @return The promise to delay for the number of provided milliseconds.
 */
function delayAsync(): Promise<mio.IOption<void>> {
  return mio.promise<void>(callback => setTimeout(callback, delayInMilliseconds));
}

/**
 * Promises to try to fetch the contents of the HTTP resource
 * @param method The method.
 * @param responseType The response type.
 * @param addresses Each address.
 * @param headers Each header.
 * @param requestType The request type.
 * @param formData Each form key/value pair.
 * @return The promise to try to fetch the contents of the HTTP resource
 */
async function fetchAnyAsync(method: string, responseType: ResponseType, addresses: string[], headers: mio.IDictionary, requestType: mio.RequestType, formData: mio.IDictionary): Promise<any> {
  let attempts = requestType === mio.RequestType.BasicWithRetry || requestType === mio.RequestType.TimeoutWithRetry ? maximumAttempts : 1;
  let previousError: any;
  for (let currentAttempt = 0; currentAttempt < attempts; currentAttempt++) {
    for (let currentAddress of addresses) {
      try {
        return await fetchAsync(method, responseType, currentAddress, headers, requestType, formData);
      } catch (error) {
        previousError = error;
        await delayAsync();
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
 * Promises to fetch the contents of the HTTP resource.
 * @param method The method.
 * @param responseType The response type.
 * @param addresses Each address.
 * @param headers Each header.
 * @param requestType The request type.
 * @param formData Each form key/value pair.
 * @return The promise for the contents of the HTTP resource.
 */
function fetchAsync<T>(method: string, responseType: ResponseType, address: string, headers: mio.IDictionary, requestType: mio.RequestType, formData: mio.IDictionary): Promise<any> {
  let encoding = responseType === ResponseType.Blob ? undefined : 'utf8';
  let timeout = requestType === mio.RequestType.Basic || requestType === mio.RequestType.BasicWithRetry ? 0 : timeoutInMilliseconds;
  return new Promise((resolve, reject) => {
    let options = {encoding: encoding, form: formData, gzip: true, headers: headers, jar: true, method: method, timeout: timeout, url: address};
    headers['User-Agent'] = headers['User-Agent'] || userAgent;
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        if (responseType === ResponseType.Json) {
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
