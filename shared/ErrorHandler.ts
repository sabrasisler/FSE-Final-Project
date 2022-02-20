import { Request, Response, NextFunction } from 'express';
import { exit } from 'process';
import { ControllerErrors } from '../controllers/ControllerErrors';
import { HttpStatusCode } from '../controllers/HttpStatusCode';
import CustomError from './CustomError';

export default class ErrorHandler {
  public static createError = (
    message: string,
    err?: any,
    statusCode?: HttpStatusCode
  ): CustomError => {
    let status: HttpStatusCode = HttpStatusCode.internalError;
    if (statusCode) {
      status = statusCode;
    }
    if (err instanceof Error) {
      return new CustomError(status, err.message, true);
    } else {
      return new CustomError(status, message, true);
    }
  };

  public static handleNull = (object: any, message: string): void => {
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

  public static returnObjectOrNullError = <T>(
    object: T | null,
    message: string
  ): T => {
    if (object == null) {
      throw new CustomError(HttpStatusCode.notFound, message, true);
    }
    return object;
  };

  public static isOperationalError(err: any) {
    if (err instanceof CustomError) {
      return err.isOperational;
    }
    return false;
  }
  public static handleCentralError = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof CustomError && err.isOperational) {
      console.log(err.status);
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
