import * as mio from '../../default';

/**
 * Represents a HTTP service.
 */
export interface IHttpService {
  /**
   * Creates a handler to retrieve the contents of the HTTP resource as a blob.
   * @param address The address, or addresses.
   * @param controlType= The control type.
   * @param headers= Each header.
   * @return The handler to retrieve the contents of the HTTP resource as a blob.
   */
  blob: (address: string | string[], controlType?: mio.ControlType, headers?: mio.IDictionary) => IHttpServiceHandler<mio.IBlob>;

  /**
   * Creates a handler to retrieve the contents of the HTTP resource as a deserialized JSON object.
   * @param address The address, or addresses.
   * @param controlType= The control type.
   * @param headers= Each header.
   * @return The handler to retrieve the contents of the HTTP resource as a deserialized JSON object.
   */
  json: <T>(address: string | string[], controlType?: mio.ControlType, headers?: mio.IDictionary) => IHttpServiceHandler<T>;

  /**
   * Creates a handler to retrieve the contents of the HTTP resource as text.
   * @param address The address, or addresses.
   * @param controlType= The control type.
   * @param headers= Each header.
   * @return The handler to retrieve the contents of the HTTP resource as text.
   */
  text: (address: string | string[], controlType?: mio.ControlType, headers?: mio.IDictionary) => IHttpServiceHandler<string>;
}

/**
 * Represents a HTTP service handler.
 */
export interface IHttpServiceHandler<T> {
  /**
   * Promises the contents of the HTTP resource.
   * @param formData= Each form key/value pair.
   * @return The promise for the contents of the HTTP resource.
   */
  deleteAsync: (formData?: mio.IDictionary) => Promise<T>;

  /**
   * Promises the contents of the HTTP resource.
   * @return The promise for the contents of the HTTP resource.
   */
  getAsync: () => Promise<T>;

  /**
   * Promises the contents of the HTTP resource.
   * @param formData= Each form key/value pair.
   * @return The promise for the contents of the HTTP resource.
   */
  patchAsync: (formData?: mio.IDictionary) => Promise<T>;

  /**
   * Promises the contents of the HTTP resource.
   * @param formData= Each form key/value pair.
   * @return The promise for the contents of the HTTP resource.
   */
  postAsync: (formData?: mio.IDictionary) => Promise<T>;

  /**
   * Promises the contents of the HTTP resource.
   * @param formData= Each form key/value pair.
   * @return The promise for the contents of the HTTP resource.
   */
  putAsync: (formData?: mio.IDictionary) => Promise<T>;
}
