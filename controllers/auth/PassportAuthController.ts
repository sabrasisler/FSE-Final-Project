import dotenv from 'dotenv';
import passport, { authenticate } from 'passport';
import IDao from '../../daos/shared/IDao';
import IUser from '../../models/users/IUser';
import { Request, Response, NextFunction, Express, Router } from 'express';
import IPassportStrategy from './IPassPortStrategy';
import { StatusCode as Code, StatusCode } from '../shared/HttpStatusCode';
import UnauthorizedException from './UnauthorizedException';
import IValidator from '../../shared/IValidator';
import UserExistsException from './UserExistsException';
import { abort, nextTick } from 'process';
dotenv.config();

export default class PassportAuthController {
  private readonly dao: IDao<IUser>;
  private readonly validator: IValidator<IUser>;
  private readonly path: string;

  public constructor(
    app: Express,
    dao: IDao<IUser>,
    validator: IValidator<IUser>,
    strategies: IPassportStrategy[]
  ) {
    this.dao = dao;
    this.validator = validator;
    this.path = '/api/v1/auth';
    const router = Router();
    router.get('/profile', this.getProfile);
    router.get('/login/failed', this.failLogin);
    router.get('/logout', this.logout);
    router.post(
      '/login',
      passport.authenticate('local', {
        failureRedirect: `${this.path}/login/failed`,
      }),
      this.getProfile
    );
    router.post('/register', this.register);

    for (const strategy of strategies) {
      strategy.execute(this.path, router, dao, this.validator);
    }
    app.use(this.path, router);

    passport.serializeUser(function (user, done) {
      done(null, user);
    });
    passport.deserializeUser(function (user: any, done) {
      done(null, user);
    });
  }

  getProfile = (req: Request, res: Response): void => {
    if (req.user) {
      res.status(Code.ok).json(req.user);
    } else {
      throw new UnauthorizedException('Failed to get profile. Unauthorized.');
    }
  };

  failLogin = (res: Response): void => {
    res.redirect(`${process.env.CLIENT_URL!}/error`);
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    this.validator.validate(req.body);
    const userExists: boolean = await this.dao.exists(req.body);
    if (userExists) {
      throw new UserExistsException('User Already Exists');
    }
    const newUser = await this.dao.create(req.body);
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      console.log(req.session);
      res.status(StatusCode.ok).json(newUser);
    });
  };

  logout(req: Request, res: Response): void {
    req.logout();
    res.redirect(process.env.CLIENT_URL!);
  }
}
