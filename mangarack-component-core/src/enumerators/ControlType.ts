/**
 * Represents a request type.
 */
export enum ControlType {
  /**
   * Represents a request without timeout.
   */
  Basic,

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
