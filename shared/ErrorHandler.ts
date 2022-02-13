import { Request, Response, NextFunction } from 'express';
import { exit } from 'process';
import { ControllerErrors } from '../controllers/ControllerErrors';
import { HttpStatusCode } from '../controllers/HttpStatusCode';
import CustomError from './CustomError';

export default class ErrorHandler {
  public static createError = (
    err: any,
    fallbackMessage: string
  ): CustomError => {
    if (err instanceof Error) {
      return new CustomError(500, err.message, true);
    } else {
      return new CustomError(500, fallbackMessage, true);
    }
  };

  public static isOperationalError(err: any) {
    if (err instanceof CustomError) {
      return err.isOperational;
    }
    return false;
  }
  public static handleControllerError = (
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
      res.status(500).json({
        timestamp: Date.now,
        status: HttpStatusCode.internalError,
        error: ControllerErrors.SOMETHING_WENT_WRONG,
        path: req.path,
      });
      exit(1);
    }
  };
}
