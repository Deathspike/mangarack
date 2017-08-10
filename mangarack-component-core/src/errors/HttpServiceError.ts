/**
 * Represents a HTTP service error.
 */
export class HttpServiceError extends Error {
  /**
   * Contains the body.
   */
  public body: string;

  /**
   * Contains the status code.
   */
  public statusCode: number;

  /**
   * Initializes a new instance of the HttpError class.
   * @param currentState The current state.
   * @param currentState.body The body.
   * @param currentState.statusCode The status code.
   * @param message The message.
   */
  public constructor(currentState: {body: string, statusCode: number}, message: string) {
    super(message);
    this.body = currentState.body;
    this.statusCode = currentState.statusCode;
  }

  /**
   * Determines whether the error is a HttpServiceError.
   * @param error The error.
   * @return Indicates whether the error is a HttpServiceError.
   */
  public static isInstance(error: Error): error is HttpServiceError {
    let httpError = error as HttpServiceError;
    return httpError && typeof httpError.body !== 'undefined' && typeof httpError.statusCode !== 'undefined';
  }
}
