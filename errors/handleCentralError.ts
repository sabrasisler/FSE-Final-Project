import { StatusCode } from '../controllers/shared/HttpStatusCode';
import { Request, Response, NextFunction } from 'express';
import BaseError from './BaseError';
import { exit } from 'process';
export const handleCentralError = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log(err); // TODO: Add logger here.
  const clientResponse = {
    timestamp: Date.now,
    status: StatusCode.internalError,
    error: 'Sorry, something went wrong!',
    path: req.path,
  };
  if (err instanceof BaseError && err.code !== StatusCode.internalError) {
    clientResponse.status = err.code;
    clientResponse.error = err.message;
  }

  if (err instanceof BaseError && err.code === StatusCode.notFound) {
    clientResponse.error = 'Sorry, resource not found!';
  }

  if (err instanceof BaseError && err.isOperational) {
    res.status(clientResponse.status).json(clientResponse);
  }

  // if (!(err instanceof BaseError && err.isOperational)) {
  //   exit(1); // exit in the case of uncaught unexpected errors
  // }
};

export const handleUncaughtException = () => {
  process.on('uncaughtException', (err) => {
    if (!(err instanceof BaseError && err.isOperational)) {
      exit(1); // exit in the case of uncaught unexpected errors
    }
    console.log('Uncaught Exception: ', err);
    //TODO: Log error
  });
};
