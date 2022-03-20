import { StatusCode } from '../controllers/shared/HttpStatusCode';
import BaseError from './BaseError';

export default class InvalidEntityException extends BaseError {
  public code: StatusCode;

  constructor(message: string) {
    super(message);
    this.code = StatusCode.badRequest;
    Object.freeze(this);
  }
}
