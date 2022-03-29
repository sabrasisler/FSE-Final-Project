import dotenv from 'dotenv';
import { Router, Express, Request, Response, NextFunction } from 'express';
import passport, { PassportStatic } from 'passport';
import IPassportStrategy from './IPassPortStrategy';
import { Strategy } from 'passport-google-oauth20';
import { Passport } from 'passport';
import IDao from '../../daos/shared/IDao';
import IUser from '../../models/users/IUser';
import { IUserDao } from '../../daos/users/IUserDao';
import AuthException from './AuthException';
import { StatusCode } from '../shared/HttpStatusCode';
import { handleCentralError } from '../../errors/handleCentralError';
dotenv.config();

export default class PassportGoogleStrategy implements IPassportStrategy {
  public constructor() {}
  execute(path: string, router: Router, dao: IUserDao): void {
    passport.use(
      new Strategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          callbackURL: `${path}/google/callback`,
        },
        async function (
          accessToken: any,
          refreshToken: any,
          profile: any,
          done: Function
        ) {
          try {
            // console.log(profile);
            const user: IUser = {
              name: profile.displayName,
              password: undefined!,
              bio: undefined!,
              profilePhoto: profile.photos[0].value,
              birthday: undefined!,
              accountType: undefined!,
              headerImage: undefined!,
              username: undefined!,
              email: profile.emails[0].value,
            };
            const dbUser: IUser = await dao.create(user);
            return done(null, dbUser);
          } catch (err) {
            return done(err, null);
          }
        }
      )
    );
    router.get(
      '/google',
      passport.authenticate('google', { scope: ['profile', 'email'] })
    );
    // router.get(
    //   '/google/callback',
    //   passport.authenticate('google', {
    //     successReturnToOrRedirect: process.env.CLIENT_URL!,
    //     failureRedirect: `${path}/login/failed`,
    //   })
    // );

    // router.get(
    //   '/google/callback',
    //   (
    //     req: Request,
    //     res: Response,
    //     next: NextFunction // Wrap authenticate call to handle errors.
    //   ) =>
    //     passport.authenticate(
    //       'google',
    //       // {
    //       //   successReturnToOrRedirect: process.env.CLIENT_URL!,
    //       //   failureRedirect: `${path}/login/failed`,
    //       // },
    //       (err, user) => {
    //         if (err) {
    //           return next(new AuthException('Google login failed', err));
    //         }

    //         //No user found?
    //         if (!user) {
    //           return next(new AuthException('Google user not found.'));
    //         }

    //         //User pending approval?
    //         if (user.isPending) {
    //           return next(new AuthException('Google user pending approval'));
    //         }

    //         //User archived?
    //         if (user.isArchived) {
    //           return next(new AuthException('Google user archived'));
    //         }

    //         //Set user in request
    //         req.logIn(user, (error) => {
    //           console.log('error?', error);
    //           if (error) {
    //             return next(
    //               new AuthException(
    //                 'Failed to log user in after Google authentication'
    //               )
    //             );
    //           }
    //           console.log(req.user);
    //           return res.redirect(`${process.env.CLIENT_URL!}`);
    //           // next();
    //         });
    //         // req.user = user;
    //         // console.log(user);
    //         // next();
    //       }
    //     )(req, res, next)
    // );

    router.get(
      '/google/callback',
      passport.authenticate('google', {
        successReturnToOrRedirect: process.env.CLIENT_URL!,
        failureRedirect: `${process.env.CLIENT_URL!}/error`,
      })
    );

    // router.get(
    //   '/google/callback',
    //   passport.authenticate('google', {
    //     successReturnToOrRedirect: process.env.CLIENT_URL!,
    //     failureRedirect: `${process.env.CLIENT_URL!}/error`,
    //   })
    // );
  }
}
