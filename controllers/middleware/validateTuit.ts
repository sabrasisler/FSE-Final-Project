import { param, body, validationResult } from 'express-validator';

export const validateTuit = [
  body('tuit')
    .exists()
    .trim()
    .isString()
    .isLength({ min: 2, max: 260 })
    .withMessage('Posts must be between 2 and 280 characters'),

  param('userId').exists().trim().isString(),
];
