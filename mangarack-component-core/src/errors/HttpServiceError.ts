/**
 * Represents a HTTP service error.
 */
export class HttpServiceError extends Error {
  /**
   * Initializes a new instance of the HttpError class.
   * @param currentState The current state.
   * @param message= The message.
   */
  constructor(currentState: {body: string, statusCode: number}, message?: string) {
    super(message);
    this.body = currentState.body;
    this.statusCode = currentState.statusCode;
  }

  /**
   * Contains the body.
   */
  public body: string;

  /**
   * Contains the status code.
   */
  public statusCode: number;
}
