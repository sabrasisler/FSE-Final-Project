import dotenv from 'dotenv';
import { Router } from 'express';
import passport from 'passport';
import IPassportStrategy from './IPassPortStrategy';
import { Strategy } from 'passport-local';
import IDao from '../../daos/shared/IDao';
import IUser from '../../models/users/IUser';
import IValidator from '../../shared/IValidator';
dotenv.config();

export default class PassportLocalStrategy implements IPassportStrategy {
  public constructor() {}
  execute(
    path: string,
    router: Router,
    userDao: IDao<IUser>,
    validator: IValidator<IUser>
  ): void {
    passport.use(
      'local',
      new Strategy(
        { passReqToCallback: true },
        async (req, username, password, done) => {
          const userId = req.body.id;
          try {
            const existingUser: IUser = await userDao.findById(userId);
            return done(null, existingUser);
          } catch (err) {
            return done(err);
          }
        }
      )
    );
  }
}
