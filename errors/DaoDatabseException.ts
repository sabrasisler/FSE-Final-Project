import { HttpStatusCode } from '../controllers/shared/HttpStatusCode';
import BaseError from './BaseError';

export default class DaoDatabaseException extends BaseError {
  public code: HttpStatusCode;

  constructor(message: string, error?: unknown) {
    super(message, error);
    this.code = HttpStatusCode.internalError;
    Object.freeze(this);
  }
}
