/**
 * Represents a strategy type.
 */
export enum StrategyType {
  /**
   * Represents a single request without timeout.
   */
  Basic,

  /**
   * Represents a retried request without timeout.
   */
  BasicWithRetry,

  /**
   * Represents a single request with timeout.
   */
  Timeout,

  /**
   * Represents a retried request with timeout.
   */
  TimeoutWithRetry
};
