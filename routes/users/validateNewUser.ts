import { Request, Response, NextFunction } from 'express';
import { body, validationResult, ValidationError } from 'express-validator';

export const validateNewUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  body('email').not().isEmpty().isEmail().normalizeEmail().trim().escape();
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    throw new Error('Validator Error!');
  } else {
    next();
  }
};
