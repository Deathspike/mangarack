import * as mio from '../../default';

/**
 * Represents a HTTP service.
 */
export interface IHttpService {
  /**
   * Promises the contents of the HTTP resource.
   * @param address The address, or addresses, of the HTTP resource.
   * @param headers= Each header.
   * @return The promise for the contents of the HTTP resource.
   */
  getBlobAsync: (address: string|string[], headers?: {[key: string]: string}) => Promise<mio.IBlob>;

  /**
   * Promises the contents of the HTTP resource.
   * @param address The address, or addresses, of the HTTP resource.
   * @param headers= Each header.
   * @return The promise for the contents of the HTTP resource.
   */
  getStringAsync: (address: string|string[], headers?: {[key: string]: string}) => Promise<string>;

  /**
   * Promises the contents of the HTTP resource.
   * @param address The address, or addresses, of the HTTP resource.
   * @param form The form.
   * @param headers= Each header.
   * @return The promise for the contents of the HTTP resource.
   */
  postBlobAsync: (address: string|string[], form: {[key: string]: string}, headers?: {[key: string]: string}) => Promise<mio.IBlob>;

  /**
   * Promises the contents of the HTTP resource.
   * @param address The address, or addresses, of the HTTP resource.
   * @param form The form.
   * @param headers= Each header.
   * @return The promise for the contents of the HTTP resource.
   */
  postStringAsync: (address: string|string[], form: {[key: string]: string}, headers?: {[key: string]: string}) => Promise<string>;
}
