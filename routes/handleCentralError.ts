import HttpRequest from '../controllers/shared/HttpRequest';
import { HttpStatusCode } from '../controllers/shared/HttpStatusCode';
import { Request, Response, NextFunction } from 'express';
import BaseError from '../errors/BaseError';
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
    status: HttpStatusCode.internalError,
    error: 'Sorry, something went wrong!',
    path: req.path,
  };
  if (err instanceof BaseError && err.code === HttpStatusCode.notFound) {
    clientResponse.error = 'Sorry, resource not found!';
    clientResponse.status = err.code;
  }
  res.status(HttpStatusCode.internalError).json(clientResponse);
  if (!(err instanceof BaseError && err.isOperational)) {
    exit(1); // exit in the case of uncaught unexpected errors
  }
};
