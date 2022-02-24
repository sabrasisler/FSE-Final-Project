import IError from './IError';

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
