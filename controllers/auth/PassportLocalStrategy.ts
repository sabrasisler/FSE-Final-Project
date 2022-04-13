import dotenv from 'dotenv';
import { NextFunction, Router, Request, Response } from 'express';
import passport from 'passport';
import IPassportStrategy from './IPassPortStrategy';
import { Strategy } from 'passport-local';
import IDao from '../../daos/shared/IDao';
import IUser from '../../models/users/IUser';
import IHasher from './IHasher';
import UnauthorizedException from './UnauthorizedException';
import { validateLogin } from '../middleware/validateUser';
import AuthException from './AuthException';
import { StatusCode } from '../shared/HttpStatusCode';

dotenv.config();

export default class PassportLocalStrategy implements IPassportStrategy {
  private readonly hasher: IHasher;
  public constructor(hasher: IHasher) {
    this.hasher = hasher;
  }
  execute(path: string, router: Router, userDao: IDao<IUser>): void {
    passport.use(
      'local',
      new Strategy(
        { passReqToCallback: true },
        async (req, username, password, done) => {
          console.log(req.body);
          try {
            let databaseUser: IUser = await userDao.findOneByField(
              req.body.username
            );
            // const emailMatches = databaseUser.email === email;
            const passwordMatches = await this.hasher.compare(
              req.body.password,
              databaseUser.password
            );
            if (!passwordMatches)
              throw new UnauthorizedException(
                'Login error: Password or username/email does not match.'
              );
            databaseUser.password = '*******';
            return done(null, databaseUser);
          } catch (err) {
            return done(
              new UnauthorizedException(
                'Login error: Username/email or password not found.'
              )
            );
          }
        }
      )
    );

    router.post('/login', (req: Request, res: Response, next: NextFunction) =>
      passport.authenticate('local', (err, user) => {
        if (err) {
          return next(err);
        }
        if (user) {
          req.logIn(user, (err) => {
            if (err) {
              return next(new AuthException('Failed to log into session.'));
            }
            res.status(StatusCode.ok).json(user);
          });
        }
      })(req, res, next)
    );
  }
}
