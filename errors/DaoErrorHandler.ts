import { StatusCode } from '../controllers/shared/HttpStatusCode';
import BaseError from './BaseError';
import DaoDatabaseException from './DaoDatabseException';
import DaoNullException from './DaoNullException';
import IError from './IError';
import IErrorHandler from './IErrorHandler';

/**
 * Strategy that handles all errors at all layers of the application. Commonly used in the DAOs for local errors and in express middleware for centralized error handling. Implements {@link IErrorHandler}.
 */
export default class DaoErrorHandler implements IErrorHandler {
  public constructor() {
    Object.freeze(this); // Make this object immutable.
  }
  /**
   * Takes any error caught by the dao caller, and either returns a {@link DaoDatabaseException} or returns the argument error. If the argument is an instance of the abstract error class {@link BaseError}, then it is a local application error, so just return the error. If not, then it is likely an error from the database, and so this methods wraps it in a more meaningful context with a DaoDatabaseException.
   * @param {string} message the custom message for the error to be created
   * @param {unknown} err the error sent by the caller: This is typically called by class that has caught an error or needs to deal with a known or unknown exception.
   * @param {StatusCode} statusCode status code of the error
   * @return {IError} implementation
   */
  public handleError = (
    message: string,
    err: any,
    statusCode?: StatusCode
  ): IError => {
    if (err instanceof BaseError) {
      return err;
    } else {
      return new DaoDatabaseException(message, err);
    }
  };

  /**
   * Handles a null object by throwing exception if null or returning the object itself if not null.
   * @param {Object} object the object being checked for null
   * @param {string} message the potential error message for the null exception should the object be null
   * @returns param object if not null
   */
  public objectOrNullException = <T>(object: T | null, message: string): T => {
    if (object === null) {
      throw new DaoNullException(message);
    }
    return object;
  };

  public returnEmptyObjIfNull = <T>(object: T): any => {
    if (object === null) {
      return {};
    }
    return object;
  };
}
