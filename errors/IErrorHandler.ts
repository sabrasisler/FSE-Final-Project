import { Request, Response, NextFunction } from 'express';
import { StatusCode } from '../controllers/shared/HttpStatusCode';
import IError from './IError';

/**
 * Common operations of a global application error handler used by all classes as a dependency.
 */
export default interface IErrorHandler {
  handleError(message: string, err: any, statusCode?: StatusCode): IError;
  objectOrNullException<T>(object: T | null, message: string): T;
  returnEmptyObjIfNull<T>(object: T): T | {};
}
