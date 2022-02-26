import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../controllers/HttpStatusCode';
import IError from './IError';

/**
 * Common operations of a global application error handler used by all classes as a dependency.
 */
export default interface IErrorHandler {
  createError(message: string, err: any, statusCode?: HttpStatusCode): IError;
  handleCentralError(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void;
  sameObjectOrNullException<T>(object: T | null, message: string): T;
}
