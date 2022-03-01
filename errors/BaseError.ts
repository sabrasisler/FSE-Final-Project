import { HttpStatusCode } from '../controllers/HttpStatusCode';
import IError from './IError';

export default abstract class BaseError extends Error {
  public readonly isOperational: boolean = true;
  public abstract readonly status: HttpStatusCode;
  constructor(message: string, err?: unknown) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // restore chain
    Error.captureStackTrace(this);

    if (err instanceof Error) {
      this.message = this.message + '\nOriginal Error Message: ' + err.message;
    }
  }
}
