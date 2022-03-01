import { HttpStatusCode } from '../controllers/HttpStatusCode';
import BaseError from './BaseError';

export default class DaoDatabaseException extends BaseError {
  public status: HttpStatusCode;

  constructor(message: string, error: unknown) {
    super(message, error);
    this.status = HttpStatusCode.internalError;
    Object.freeze(this);
  }
}
