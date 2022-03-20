import { StatusCode } from '../controllers/shared/HttpStatusCode';
import BaseError from './BaseError';

export default class DaoNullException extends BaseError {
  public code = StatusCode.notFound;
  constructor(message: string) {
    super(message);
    Object.freeze(this);
  }
}
