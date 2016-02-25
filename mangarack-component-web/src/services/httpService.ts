import * as mio from '../default';
import {ResponseType} from './enumerators/ResponseType';
let delayInMilliseconds = 2000;
let maximumAttempts = 5;
let timeoutInMilliseconds = 30000;

/**
 * Represents a HTTP service.
 * @internal
 */
export var httpService: mio.IHttpService = {
  /**
   * Creates a handler to retrieve the contents of the HTTP resource as a blob.
   * @param address The address, or addresses.
   * @param headers Each header.
   * @param strategy The strategy type.
   * @return The handler to retrieve the contents of the HTTP resource as a blob.
   */
  blob: function(address: string|string[], headers: mio.IDictionary, strategy: mio.StrategyType): mio.IHttpServiceHandler<mio.IBlob> {
    let addresses = Array.isArray(address) ? address : [address];
    return createHandler(ResponseType.Blob, addresses, headers, strategy);
  },

  /**
   * Creates a handler to retrieve the contents of the HTTP resource as a deserialized JSON object.
   * @param address The address, or addresses.
   * @param headers Each header.
   * @param strategy The strategy type.
   * @return The handler to retrieve the contents of the HTTP resource as a deserialized JSON object.
   */
  json: function<T>(address: string|string[], headers: mio.IDictionary, strategy: mio.StrategyType): mio.IHttpServiceHandler<T> {
    let addresses = Array.isArray(address) ? address : [address];
    return createHandler(ResponseType.Json, addresses, headers, strategy);
  },

  /**
   * Creates a handler to retrieve the contents of the HTTP resource as text.
   * @param address The address, or addresses.
   * @param headers Each header.
   * @param strategy The strategy type.
   * @return The handler to retrieve the contents of the HTTP resource as text.
   */
  text: function(address: string|string[], headers: mio.IDictionary, strategy: mio.StrategyType): mio.IHttpServiceHandler<string> {
    let addresses = Array.isArray(address) ? address : [address];
    return createHandler(ResponseType.Text, addresses, headers, strategy);
  }
};

/**
 * Creates a service handler.
 * @param type The response type.
 * @param addresses The addresses.
 * @param headers The headers.
 * @param strategy The strategy type.
 * @return The service handler.
 */
function createHandler<T>(type: ResponseType, addresses: string[], headers: mio.IDictionary, strategy: mio.StrategyType): mio.IHttpServiceHandler<T> {
  return {
    deleteAsync: formData => fetchAnyAsync('DELETE', type, addresses, headers, strategy, formData),
    getAsync: () => fetchAnyAsync('GET', type, addresses, headers, strategy, {}),
    patchAsync: formData => fetchAnyAsync('PATCH', type, addresses, headers, strategy, formData),
    postAsync: formData => fetchAnyAsync('POST', type, addresses, headers, strategy, formData),
    putAsync: formData => fetchAnyAsync('PUT', type, addresses, headers, strategy, formData)
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
 * @param strategy The strategy type.
 * @param formData Each form key/value pair.
 * @return The promise to try to fetch the contents of the HTTP resource
 */
async function fetchAnyAsync(method: string, responseType: ResponseType, addresses: string[], headers: mio.IDictionary, strategy: mio.StrategyType, formData: mio.IDictionary): Promise<any> {
  let attempts = strategy === mio.StrategyType.BasicWithRetry || strategy === mio.StrategyType.TimeoutWithRetry ? maximumAttempts : 1;
  let previousError: any;
  for (let currentAttempt of Array(attempts).keys()) {
    for (let currentAddress of addresses) {
      try {
        return await fetchAsync(method, responseType, currentAddress, headers, strategy, formData);
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
 * @param strategy The strategy type.
 * @param formData Each form key/value pair.
 * @return The promise for the contents of the HTTP resource.
 */
function fetchAsync<T>(method: string, responseType: ResponseType, address: string, headers: mio.IDictionary, strategy: mio.StrategyType, formData: mio.IDictionary): Promise<any> {
  let timeout = strategy === mio.StrategyType.Basic || strategy === mio.StrategyType.BasicWithRetry ? 0 : timeoutInMilliseconds;
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    if (responseType === ResponseType.Blob) {
      xhr.responseType = 'blob';
    }
    xhr.addEventListener('error', () => {
      reject(new mio.HttpServiceError({
        body: String(xhr.response || ''),
        statusCode: xhr.status || 0
      }, `Invalid HTTP response: ${address}`));
    });
    xhr.addEventListener('load', () => {
      if (xhr.status !== 200) {
        reject(new mio.HttpServiceError({
          body: String(xhr.response || ''),
          statusCode: xhr.status || 0
        }, `Invalid HTTP response: ${address}`));
      } else {
        resolve(responseType === ResponseType.Json ? JSON.parse(xhr.responseText) : xhr.response);
      }
    });
    if (timeout) {
      xhr.timeout = timeout;
    }
    xhr.open(method, address);
    for (let key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }
    if (Object.keys(formData).length) {
      var formString = ''
      for (var key in formData) {
        if (formString) {
          formString += '&';
        }
        formString += encodeURIComponent(key) + '=' + encodeURIComponent(formData[key]);
      }
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(formString);
    } else {
      xhr.send();
    }
  });
}
