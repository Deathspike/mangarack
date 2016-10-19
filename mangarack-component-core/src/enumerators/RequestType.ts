/**
 * Represents a request type.
 */
export enum RequestType {
  /**
   * Represents a request without timeout.
   */
  Basic = 1,

  /**
   * Represents a request without timeout, but with retries.
   */
  BasicWithRetry,

  /**
   * Represents a request with timeout.
   */
  Timeout,

  /**
   * Represents a request with timeout and retries.
   */
  TimeoutWithRetry
};
