import { Request, Response, NextFunction } from 'express';
import CustomError from './CustomError';

export const handleErrorsMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Triggered');
  if (err instanceof CustomError) {
    // res.status(err.status).send({ error: err.message });
    console.log('error');
  } else {
    // res.status(500).send({ error: 'Something went wrong.' });
    console.log('somethign wrong');
  }
  next();
};
