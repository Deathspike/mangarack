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
   * @param message The message.
   */
  public constructor(currentState: {body: string, statusCode: number}, message: string) {
    super(message);
    this.body = currentState.body;
    this.statusCode = currentState.statusCode;
  }
}
