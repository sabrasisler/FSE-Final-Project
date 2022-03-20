import { StatusCode } from '../controllers/shared/HttpStatusCode';
import BaseError from './BaseError';

export default class MongooseException extends BaseError {
  public code: StatusCode;

  constructor(message: string, error?: unknown) {
    message = 'Mongoose Schema hook error: ' + message;
    super(message, error);
    this.code = StatusCode.internalError;
    Object.freeze(this);
  }
}
