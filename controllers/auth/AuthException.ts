import BaseError from '../../errors/BaseError';
import { StatusCode } from '../shared/HttpStatusCode';

export default class AuthException extends BaseError {
  public code = StatusCode.internalError;
  constructor(message: string, error?: unknown) {
    super(message, error);
    Object.freeze(this);
  }
}
