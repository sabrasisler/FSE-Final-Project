import { Request, Response, NextFunction } from 'express';
import { exit } from 'process';
import { ControllerErrors } from '../controllers/ControllerErrors';
import { HttpStatusCode } from '../controllers/HttpStatusCode';
import CustomError from './CustomError';

export const handleControllerError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Triggered');
  if (err instanceof CustomError && err.isOperational) {
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
