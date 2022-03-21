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
            return done(err);
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
    //   }, )
    // );

    router.get(
      '/google/callback',
      (
        req: Request,
        res: Response,
        next: NextFunction // Wrap authenticate call to handle errors.
      ) =>
        passport.authenticate(
          'google',
          {
            successReturnToOrRedirect: process.env.CLIENT_URL!,
            failureRedirect: `${path}/login/failed`,
          },
          (err, user, info) => {
            if (err) {
              res.redirect(`${process.env.CLIENT_URL!}/error`);
              // TODO: Logger here
              console.log('ERROR', err);
              next();
            } else {
              req.logIn(user, function (err) {
                if (err) res.redirect(`${process.env.CLIENT_URL!}/error`);
                res.redirect(`${process.env.CLIENT_URL!}`);
              });
            }
          }
        )(req, res, next)
    );
  }
}
