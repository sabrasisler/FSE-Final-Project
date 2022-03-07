import { HttpStatusCode } from '../controllers/shared/HttpStatusCode';
import BaseError from './BaseError';

export default class DaoNullException extends BaseError {
  public code = HttpStatusCode.notFound;
  constructor(message: string) {
    super(message);
    Object.freeze(this);
  }
}
