import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { StatusCode } from '../shared/HttpStatusCode';
export const validateResults = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = validationResult(req).array();
  if (!result.length) return next();
  // const errors: {}[] = [];
  // result.map((error) => {
  //   errors.push({ message: error.msg, field: error.param });
  // }),
  res.status(StatusCode.badRequest).json({ error: result[0].msg });
};
