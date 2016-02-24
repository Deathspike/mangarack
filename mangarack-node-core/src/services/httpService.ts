import * as mio from '../default';
import * as request from 'request';
import {ResponseType} from '../enumerators/ResponseType';
let delayInMilliseconds = 1000;
let maximumAttempts = 10;
let timeoutInMilliseconds = 5000;
let userAgent = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

/**
 * Represents a HTTP service.
 * @internal
 */
export var httpService: mio.IHttpService = {
  /**
   * Creates a handler to retrieve the contents of the HTTP resource as a blob.
   * @param address The address, or addresses, of the HTTP resource.
   * @param headers Each header.
   * @param strategy The strategy type.
   * @return The handler to retrieve the contents of the HTTP resource as a blob.
   */
  blob: function(address: string|string[], headers: mio.IDictionary, strategy: mio.StrategyType): mio.IHttpServiceHandler<mio.IBlob> {
    return createHttpServiceHandler(ResponseType.Blob, address, headers, strategy);
  },

  /**
   * Creates a handler to retrieve the contents of the HTTP resource as a deserialized JSON object.
   * @param address The address, or addresses, of the HTTP resource.
   * @param headers Each header.
   * @param strategy The strategy type.
   * @return The handler to retrieve the contents of the HTTP resource as a deserialized JSON object.
   */
  json: function<T>(address: string|string[], headers: mio.IDictionary, strategy: mio.StrategyType): mio.IHttpServiceHandler<T> {
    return createHttpServiceHandler(ResponseType.Json, address, headers, strategy);
  },

  /**
   * Creates a handler to retrieve the contents of the HTTP resource as text.
   * @param address The address, or addresses, of the HTTP resource.
   * @param headers Each header.
   * @param strategy The strategy type.
   * @return The handler to retrieve the contents of the HTTP resource as text.
   */
  text: function(address: string|string[], headers: mio.IDictionary, strategy: mio.StrategyType): mio.IHttpServiceHandler<string> {
    return createHttpServiceHandler(ResponseType.Text, address, headers, strategy);
  }
};

/**
 * Creates an HTTP service handler.
 * @param type The request type.
 * @param address The address, or addresses, of the HTTP resource.
 * @param headers The headers.
 * @param strategy The strategy type.
 * @return The HTTP service handler.
 */
function createHttpServiceHandler<T>(type: ResponseType, address: string|string[], headers: mio.IDictionary, strategy: mio.StrategyType): mio.IHttpServiceHandler<T> {
  let addresses = Array.isArray(address) ? address : [address];
  return {
    deleteAsync: (formData: mio.IDictionary) => tryAsync('DELETE', type, addresses, headers, strategy, formData),
    getAsync: () => tryAsync('GET', type, addresses, headers, strategy, {}),
    patchAsync: (formData: mio.IDictionary) => tryAsync('PATCH', type, addresses, headers, strategy, formData),
    postAsync: (formData: mio.IDictionary) => tryAsync('POST', type, addresses, headers, strategy, formData),
    putAsync: (formData: mio.IDictionary) => tryAsync('PUT', type, addresses, headers, strategy, formData)
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
 * Promises to fetch the contents of the HTTP resource.
 * @param method The method.
 * @param type The request type.
 * @param address The address of the HTTP resource.
 * @param headers Each header.
 * @param strategy The strategy type.
 * @param formData Each form key/value pair.
 * @return The promise for the contents of the HTTP resource.
 */
function fetchAsync<T>(method: string, type: ResponseType, address: string, headers: mio.IDictionary, strategy: mio.StrategyType, formData: mio.IDictionary): Promise<any> {
  return new Promise((resolve, reject) => {
    headers['User-Agent'] = headers['User-Agent'] || userAgent;
    request({
      encoding: type == ResponseType.Blob ? null : 'utf8',
      headers: headers,
      form: formData,
      gzip: true,
      jar: true,
      method: method,
      timeout: strategy === mio.StrategyType.Basic || strategy === mio.StrategyType.BasicWithRetry ? 0 : timeoutInMilliseconds,
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
 * @param strategy The strategy type.
 * @param formData Each form key/value pair.
 * @return The promise to try to fetch the contents of the HTTP resource
 */
async function tryAsync(method: string, type: ResponseType, addresses: string[], headers: mio.IDictionary, strategy: mio.StrategyType, formData: mio.IDictionary): Promise<any> {
  let attempts = strategy === mio.StrategyType.BasicWithRetry || strategy === mio.StrategyType.TimeoutWithRetry ? maximumAttempts : 1;
  let previousError: any;
  for (let currentAttempt of Array(attempts).keys()) {
    for (let currentAddress of addresses) {
      try {
        return await fetchAsync(method, type, currentAddress, headers, strategy, formData);
      } catch (error) {
        previousError = error;
      }
    }
    await delayAsync();
  }
  if (previousError) {
    throw previousError;
  } else {
    throw new Error(`Invalid HTTP response: ${addresses.join(', ')}`);
  }
}
