import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from '../controllers/HttpStatusCode';
import IError from './IError';
export default interface IErrorHandler {
  createError(message: string, err?: any, statusCode?: HttpStatusCode): IError;
  handleCentralError(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void;
  handleNull(object: any, message: string): void;
  sameObjectOrNullException<T>(object: T | null, message: string): T;
}
