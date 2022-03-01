import { HttpStatusCode } from '../controllers/HttpStatusCode';
import BaseError from './BaseError';

export default class DaoNullException extends BaseError {
  public status = HttpStatusCode.notFound;
  constructor(message: string) {
    super(message);
    Object.freeze(this);
  }
}
