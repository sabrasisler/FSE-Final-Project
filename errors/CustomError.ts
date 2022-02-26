import IError from './IError';

/**
 * A common custom error for the application that extends {@link Error} and implements {@link IError}. Contains additional meta data about the status code of the error and whether the error is operational (that is, an intended application error).
 */
export default class CustomError extends Error implements IError {
  public readonly isOperational: boolean;
  public readonly status: number;
  constructor(status: number, message: string, isOperational: boolean) {
    console.log(status);
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.isOperational = isOperational;
    this.status = status;
    Error.captureStackTrace(this);
    Object.freeze(this);
  }
}
