import { param, body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ResourceLimits } from 'worker_threads';
import { StatusCode } from '../shared/HttpStatusCode';
import { UserErrorMessages as UserValidationMessages } from '../../models/users/UserErrorMessages';

export const validateProfile = [
  param('userId').isString(),
  body('email').trim().isEmail(),
  body('username')
    .trim()
    .not()
    .isEmpty()
    .isLength({ min: 3, max: 15 })
    .withMessage(UserValidationMessages.INVALID_USERNAME),
  body('bio')
    .trim()
    .isLength({ min: 0, max: 160 })
    .withMessage(UserValidationMessages.INVALID_BIO),
];

export const validatePassword = [
  body('password')
    .trim()
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/)
    .withMessage(UserValidationMessages.INVALID_PASSWORD),
];

export const validationResults = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = validationResult(req).array();
  if (!result.length) return next();
  const errors: {}[] = [];
  result.map((error) => {
    errors.push({ message: error.msg, field: error.param });
  }),
    res.status(StatusCode.badRequest).json({ errors: errors });
};
