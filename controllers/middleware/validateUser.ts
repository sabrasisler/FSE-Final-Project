import { param, body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ResourceLimits } from 'worker_threads';
import { StatusCode } from '../shared/HttpStatusCode';
import { UserErrorMessages as UserValidationMessages } from '../../models/users/UserErrorMessages';
import IUser from '../../models/users/IUser';
import { AccountType } from '../../models/users/AccoutType';

export const validateRegistration = [
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
  body('birthday').trim().isDate(),
  body('accountType').trim().toUpperCase().isIn(Object.values(AccountType)),
  // body('headerImage')
  //   .exists()
  //   .trim()
  //   .matches(/\.(jpe?g|png)$/i)
  //   .withMessage('Profile header image invalid.'),
  // body('profilePhoto')
  //   .exists()
  //   .trim()
  //   .matches(/\.(jpe?g|png)$/i)
  //   .withMessage('Profile photo invalid.'),
];

export const validateProfile = [
  param('userId').isString(),
  ...validateRegistration,
];

export const validatePassword = [
  body('password')
    .trim()
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/)
    .withMessage(UserValidationMessages.INVALID_PASSWORD),
];

export const validateLogin = [
  body('password')
    .exists()
    .withMessage(UserValidationMessages.NO_PASSWORD)
    .trim()
    .isString()
    .isLength({ min: 1 })
    .withMessage(UserValidationMessages.NO_PASSWORD),

  body('username')
    .exists()
    .withMessage(UserValidationMessages.NO_USERNAME_EMAIL)
    .trim()
    .isString(),
];
