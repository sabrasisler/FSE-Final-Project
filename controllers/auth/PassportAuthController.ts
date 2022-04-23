import dotenv from 'dotenv';
import passport from 'passport';
import IDao from '../../daos/shared/IDao';
import IUser from '../../models/users/IUser';
import { Request, Response, NextFunction, Express, Router } from 'express';
import IPassportStrategy from './IPassPortStrategy';
import { StatusCode as Code, StatusCode } from '../shared/HttpStatusCode';
import UnauthorizedException from './UnauthorizedException';
import UserExistsException from './UserExistsException';
import IHasher from './IHasher';
import { validateRegistration } from '../middleware/validateUser';
import { validateResults } from '../middleware/validateResults';
import { addUserToSocketRoom } from '../../config/configSocketIo';
dotenv.config();

export default class PassportAuthController {
  private readonly dao: IDao<IUser>;
  private readonly path: string;
  private readonly hasher: IHasher;

  public constructor(
    app: Express,
    dao: IDao<IUser>,
    strategies: IPassportStrategy[],
    hasher: IHasher
  ) {
    this.dao = dao;
    this.hasher = hasher;

    this.path = '/api/v1/auth';
    const router = Router();
    router.get('/profile', addUserToSocketRoom, this.getProfile);
    router.get('/login/failed', this.failLogin);
    router.post('/logout', this.logout);
    router.post(
      '/register',
      validateRegistration,
      validateResults,
      this.register
    );

    for (const strategy of strategies) {
      strategy.execute(this.path, router, dao);
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
      const user: any = req.user;
      res.status(Code.ok).json(user);
    } else {
      throw new UnauthorizedException(
        'Failed to get user session. Unauthorized.'
      );
    }
  };

  failLogin = (res: Response): void => {
    res.status(403).json({ message: 'failed login' });
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    const userExists: boolean = await this.dao.exists(req.body);
    if (userExists) {
      next(new UserExistsException('User Already Exists'));
    }
    let user = req.body;
    user.password = await this.hasher.hash(req.body.password);
    const newUser = await this.dao.create(user);
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
      res.status(StatusCode.ok).json(newUser);
    });
  };

  logout(req: Request, res: Response): void {
    req.logout();
    res.sendStatus(StatusCode.ok);
  }
}
