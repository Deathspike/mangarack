import * as mio from '../default';
import * as request from 'request';
let delayInMilliseconds = 1000;
let maximumAttempts = 10;
let timeoutInMilliseconds = 5000;
let userAgent = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
type Dictionary = {[key: string]: string};

/**
 * Represents a HTTP service.
 */
export var httpService: mio.IHttpService = {
  /**
   * Promises the contents of the HTTP resource.
   * @param address The address, or addresses, of the HTTP resource.
   * @param headers= Each header.
   * @return The promise for the contents of the HTTP resource.
   */
  getBlobAsync: function(address: string|string[], headers?: Dictionary): Promise<mio.IBlob> {
    return typeof address === 'string'
      ? oneAsync(address, 1, true, null, headers)
      : anyAsync(address, true, null, headers);
  },

  /**
   * Promises the contents of the HTTP resource.
   * @param address The address, or addresses, of the HTTP resource.
   * @param headers= Each header.
   * @return The promise for the contents of the HTTP resource.
   */
  getStringAsync: function(address: string|string[], headers?: Dictionary): Promise<string> {
    return typeof address === 'string'
      ? oneAsync(address, 1, false, null, headers)
      : anyAsync(address, false, null, headers);
  },

  /**
   * Promises the contents of the HTTP resource.
   * @param address The address, or addresses, of the HTTP resource.
   * @param form The form.
   * @param headers= Each header.
   * @return The promise for the contents of the HTTP resource.
   */
  postBlobAsync: function(address: string|string[], form: Dictionary, headers?: Dictionary): Promise<mio.IBlob> {
    return typeof address === 'string'
      ? oneAsync(address, 1, false, form, headers)
      : anyAsync(address, false, form, headers);
  },

  /**
   * Promises the contents of the HTTP resource.
   * @param address The address, or addresses, of the HTTP resource.
   * @param form The form.
   * @param headers= Each header.
   * @return The promise for the contents of the HTTP resource.
   */
  postStringAsync: function(address: string|string[], form: Dictionary, headers?: Dictionary): Promise<string> {
    return typeof address === 'string'
      ? oneAsync(address, 1, false, form, headers)
      : anyAsync(address, false, form, headers);
  }
};

/**
 * Promises the contents of the HTTP resource.
 * @param addresses Each address.
 * @param blob Indicates whether the HTTP resource contains a blob.
 * @param form= The form.
 * @param headers= Each header.
 * @return The promise for the contents of the HTTP resource.
 */
async function anyAsync(addresses: string[], blob: boolean, form?: Dictionary, headers?: Dictionary): Promise<mio.IBlob|string> {
  for (let currentAttempt of Array(maximumAttempts).keys()) {
    for (let address of addresses) {
      try {
        return await oneAsync(address, maximumAttempts, blob, form, headers);
      } catch (e) {
        await delayAsync(delayInMilliseconds);
      }
    }
  }
  throw new Error(`Invalid HTTP response: ${addresses.join(', ')}`);
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
 * Promises the contents of the HTTP resource.
 * @param address The address.
 * @param attempt The attempt attempt.
 * @param blob Indicates whether the HTTP resource contains a blob.
 * @param form= The form.
 * @param headers= Each header.
 * @return The promise for the contents of the HTTP resource.
 */
function oneAsync(address: string, attempt: number, blob: boolean, form?: Dictionary, headers?: Dictionary): Promise<mio.IBlob|string> {
  return new Promise<mio.IBlob|string>((resolve, reject) => {
    headers = headers || {};
    headers['User-Agent'] = headers['User-Agent'] || userAgent;
    request({
      headers: headers,
      encoding: blob ? null : 'utf8',
      form: form,
      gzip: true,
      jar: true,
      method: form != null ? 'POST' : 'GET',
      timeout: timeoutInMilliseconds,
      url: address,
    }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body);
      } else if (attempt < maximumAttempts) {
        delayAsync(1000).then(() => oneAsync(address, attempt + 1, blob, form).then(resolve, reject), reject);
      } else {
        reject(new mio.HttpServiceError({
          body: body || '',
          statusCode: (response ? response.statusCode : 0) || 0
        }, `Invalid HTTP response: ${address}`));
      }
    });
  });
}
