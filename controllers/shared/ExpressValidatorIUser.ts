import IValidator from './IValidator';
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import IUser from '../../models/users/IUser';
export default class ExpressValidatorIUser implements IValidator<IUser> {
  validate = () => (req: Request, res: Response, next: NextFunction) => {
    // body(user.email)
    //   .not()
    //   .isEmpty()
    //   .isEmail()
    //   .normalizeEmail()
    //   .trim()
    //   .escape();
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   throw new Error('Validator Error!');
    // }
  };
}
