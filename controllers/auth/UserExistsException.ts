import BaseError from '../../errors/BaseError';
import { StatusCode } from '../shared/HttpStatusCode';

export default class UserExistsException extends BaseError {
  public code = StatusCode.conflict;
  constructor(message: string) {
    super(message);
    Object.freeze(this);
  }
}
