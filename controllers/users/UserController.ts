import { NextFunction, Request, Response } from 'express';
import IController from '../IController';
import IDao from '../../daos/IDao';
import IUser from '../../models/users/IUser';
import { HttpStatusCode } from '../HttpStatusCode';
import AbsBaseController from '../AbsBaseController';
import IRoute from '../IRoute';
import { Methods } from '../Methods';

export class UserController extends AbsBaseController implements IController {
  public path: string;
  protected routes: IRoute[];
  private readonly dao: IDao<IUser>;

  public constructor(dao: IDao<IUser>) {
    super();
    this.path = 'api/v1';
    this.dao = dao;
    this.routes = [
      {
        path: '/users',
        method: Methods.GET,
        handler: this.findAll,
        localMiddleware: [],
      },
      {
        path: '/users/:userId',
        method: Methods.GET,
        handler: this.findById,
        localMiddleware: [],
      },
      {
        path: '/users/:userId',
        method: Methods.POST,
        handler: this.create,
        localMiddleware: [],
      },
      {
        path: '/users/:userId',
        method: Methods.PUT,
        handler: this.update,
        localMiddleware: [],
      },
      {
        path: '/users/:userId',
        method: Methods.DELETE,
        handler: this.delete,
        localMiddleware: [],
      },
    ];
    Object.freeze(this);
  }
  findAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const allUsers: IUser[] | null = await this.dao.findAll();
      res.status(200).json(allUsers);
    } catch (err) {
      next(err);
    }
  };
  findById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const existingUser: IUser = await this.dao.findById(req.params.userId);
      res.status(HttpStatusCode.ok).json(existingUser);
    } catch (err) {
      next(err);
    }
  };
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const data = { ...req.body, uid: req.params.userId };
    try {
      const newUser: IUser = await this.dao.create(data);
      res.status(HttpStatusCode.ok).json(newUser);
    } catch (err) {
      next(err);
    }
  };
  update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const updatedUser = await this.dao.update(req.params.userId, req.body);
      res.status(HttpStatusCode.ok).json(updatedUser);
    } catch (err) {
      next(err);
    }
  };
  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const deletedUser = await this.dao.delete(req.params.userId);
      res.status(HttpStatusCode.ok).json(deletedUser);
    } catch (err) {
      next(err);
    }
  };
}
