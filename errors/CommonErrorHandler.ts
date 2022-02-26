import { Request, Response, NextFunction } from 'express';
import { exit } from 'process';
import { HttpStatusCode } from '../controllers/HttpStatusCode';
import CustomError from './CustomError';
import IError from './IError';
import IErrorHandler from './IErrorHandler';

/**
 * Strategy that handles all errors at all layers of the application. Commonly used in the DAOs for local errors and in express middleware for centralized error handling. Implements {@link IErrorHandler}.
 */
export default class CommonErrorHandler implements IErrorHandler {
  public constructor() {
    Object.freeze(this); // Make this object immutable.
  }
  /**
   * Takes any error caught by the caller, checks its type, and creates a local {@link CustomError} with a message and status code, which contains more detailed meta data. For safety, checks if the error is of the common type {@link Error} to extract its message to be passed to the new  custom error. If error is of unknown type, the new custom error is assigned a generic internal error status code.
   * @param {string} message the message of the error
   * @param {unknown} err the error sent by the caller: This is typically called by class that has caught an error or needs to deal with a known or unknown exception.
   * @param {HttpStatusCode} statusCode status code of the error provided by the client
   * @returns the {@link CustomError}, which implements {@link IError}
   */
  public createError = (
    message: string,
    err: any,
    statusCode?: HttpStatusCode
  ): IError => {
    let status: HttpStatusCode = HttpStatusCode.internalError;
    if (statusCode) {
      status = statusCode;
    }
    if (err instanceof CustomError) {
      return new CustomError(err.status, err.message, true);
    } else if (err instanceof Error) {
      return new CustomError(status, err.message, true);
    } else {
      return new CustomError(status, message, true);
    }
  };

  /**
   * Handles a null object by throwing exception if null or returning the object itself if not null.
   * @param {Object} object the object being checked for null
   * @param {string} message the potential error message for the null exception should the object be null
   * @returns param object if not null
   */
  public sameObjectOrNullException = <T>(
    object: T | null,
    message: string
  ): T => {
    if (object === null) {
      throw new CustomError(HttpStatusCode.notFound, message, true);
    }
    return object;
  };

  /**
   * Middleware that handles central error for the controllers. A controller passes the error to this middleware via next(). This methods does the following:
   * 1. Checks if the error is a local custom error. If so, sends the error to the client.
   * 2. Sends a generic 500 error to the client if the error is unexpected and then exists the app.
   * @param {IError} err a local or unexpected error from the caller
   * @param {Request} req the express request containing the endpoint path of the error
   * @param {Response} res the express response used to send a message to the client
   * @returns void
   */
  public handleCentralError = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    if (err instanceof CustomError && err.isOperational) {
      res.status(err.status).json({
        timestamp: Date.now,
        status: err.status,
        error: err.message,
        path: req.path,
      });
    } else {
      res.status(HttpStatusCode.internalError).json({
        timestamp: Date.now,
        status: HttpStatusCode.internalError,
        error: 'Ooops! Sorry, something went wrong.',
        path: req.path,
      });
      exit(1);
    }
  };
}
