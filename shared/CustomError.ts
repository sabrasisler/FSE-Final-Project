export default class CustomError extends Error {
  private readonly isOperational: boolean;
  public readonly status: number;
  constructor(status: number, message: string, isOperational: boolean) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    this.isOperational = isOperational;
    this.status = status;
    Error.captureStackTrace(this);
    Object.freeze(this);
  }
}
