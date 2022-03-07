import { HttpStatusCode } from '../controllers/shared/HttpStatusCode';
import BaseError from './BaseError';

export default class MongooseException extends BaseError {
  public code: HttpStatusCode;

  constructor(message: string, error?: unknown) {
    message = 'Mongoose Schema hook error: ' + message;
    super(message, error);
    this.code = HttpStatusCode.internalError;
    Object.freeze(this);
  }
}
