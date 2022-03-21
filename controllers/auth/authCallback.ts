import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { request } from 'http';
export const authCallback =
  (authFunction: Function) =>
  (req: Request, res: Response, next: NextFunction) =>
    passport.authenticate(
      'google',
      { scope: ['profile', 'email'] },
      (err, data) => {
        if (err) {
          res.status(err.oauthError.statusCode);
          res.json(data || err);
        } else {
          res.json(data);
        }
      }
    )(req, res, next);
