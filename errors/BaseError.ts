import { StatusCode } from '../controllers/shared/HttpStatusCode';

export default abstract class BaseError extends Error {
  public readonly isOperational: boolean = true;
  public abstract readonly code: StatusCode;
  constructor(message: string, err?: unknown) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // restore chain
    Error.captureStackTrace(this);

    if (err instanceof Error) {
      this.message = this.message + '\nOriginal Error Message: ' + err.message;
    }
  }
}
