import BaseError from '../../errors/BaseError';
import { StatusCode } from '../shared/HttpStatusCode';

export default class UnauthorizedException extends BaseError {
  public code = StatusCode.unauthorized;
  constructor(message: string) {
    super(message);
    Object.freeze(this);
  }
}
