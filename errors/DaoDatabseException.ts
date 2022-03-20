import { StatusCode } from '../controllers/shared/HttpStatusCode';
import BaseError from './BaseError';

export default class DaoDatabaseException extends BaseError {
  public code: StatusCode;

  constructor(message: string, error?: unknown) {
    super(message, error);
    this.code = StatusCode.internalError;
    Object.freeze(this);
  }
}
