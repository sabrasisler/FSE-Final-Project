import { Request, Response, NextFunction } from 'express';

export function passportCb(req: Request, res: Response, next: NextFunction) {
  return function (error: any, user: any) {
    //Wrap errors in not authenticated error
    if (error) {
      return next(new Error('An error exists'));
    }

    //No user found?
    if (!user) {
      return next(new Error('no user'));
    }

    //User pending approval?
    if (user.isPending) {
      return next(new Error('user is pending'));
    }

    //User archived?
    if (user.isArchived) {
      return next(new Error('user is archived'));
    }

    //Set user in request
    req.user = user;
    next();
  };
}
