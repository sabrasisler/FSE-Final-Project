import { HttpStatusCode } from '../controllers/shared/HttpStatusCode';
import BaseError from './BaseError';

export default class InvalidEntityException extends BaseError {
  public code: HttpStatusCode;

  constructor(message: string) {
    super(message);
    this.code = HttpStatusCode.badRequest;
    Object.freeze(this);
  }
}
