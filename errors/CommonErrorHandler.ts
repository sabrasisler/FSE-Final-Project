import { Request, Response, NextFunction } from 'express';
import { exit } from 'process';
import { ControllerErrors } from '../controllers/ControllerErrors';
import { HttpStatusCode } from '../controllers/HttpStatusCode';
import CustomError from './CustomError';
import IError from './IError';
import IErrorHandler from './IErrorHandler';

export default class CommonErrorHandler implements IErrorHandler {
  public createError = (
    message: string,
    err?: any,
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

  public handleNull = (object: any, message: string): void => {
    if (object === null) {
      throw new CustomError(HttpStatusCode.notFound, message, true);
    } else {
      return;
    }
  };

  // public static createNullError = (
  //   object: any,
  //   message: string
  // ): CustomError | void => {
  //   if (object == null) {
  //     return new CustomError(HttpStatusCode.notFound, message, true);
  //   }
  //   return;
  // };

  public sameObjectOrNullException = <T>(
    object: T | null,
    message: string
  ): T => {
    if (object === null) {
      throw new CustomError(HttpStatusCode.notFound, message, true);
    }
    return object;
  };

  // private isOperationalError(err: any) {
  //   if (err instanceof CustomError) {
  //     return err.isOperational;
  //   }
  //   return false;
  // }
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
        error: ControllerErrors.SOMETHING_WENT_WRONG,
        path: req.path,
      });
      exit(1);
    }
  };
}
