import ITuitController from './ITuitController';
import { NextFunction, Request, Response } from 'express';
import ITuitDao from '../../daos/tuits/ITuitDao';
import { HttpStatusCode } from '../HttpStatusCode';
import AbsBaseController from '../AbsBaseController';
import IRoute from '../IRoute';
import { Methods } from '../Methods';

export default class TuitController
  extends AbsBaseController
  implements ITuitController
{
  public path: string;
  protected routes: IRoute[];
  private readonly dao: ITuitDao;
  public constructor(dao: ITuitDao) {
    super();
    this.path = '/api/v1';
    this.dao = dao;
    this.routes = [
      {
        path: '/tuits',
        method: Methods.GET,
        handler: this.findAll,
        localMiddleware: [],
      },
      {
        path: '/tuits/:tuidId',
        method: Methods.GET,
        handler: this.findById,
        localMiddleware: [],
      },
      {
        path: '/users/:userId/tuit',
        method: Methods.GET,
        handler: this.findByUser,
        localMiddleware: [],
      },
      {
        path: '/users/:userId/tuits',
        method: Methods.POST,
        handler: this.create,
        localMiddleware: [],
      },
      {
        path: '/tuits/:tuitId',
        method: Methods.PUT,
        handler: this.update,
        localMiddleware: [],
      },
      {
        path: '/tuits/:tuitId',
        method: Methods.DELETE,
        handler: this.delete,
        localMiddleware: [],
      },
    ];
    Object.freeze(this);
  }
  findByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tuit = await this.dao.findByUser(req.params.userId);
      res.status(HttpStatusCode.ok).json(tuit);
    } catch (err) {
      next(err);
    }
  };
  findAll = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tuits = await this.dao.findAll();
      res.status(HttpStatusCode.ok).json(tuits);
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
      const tuit = await this.dao.findById(req.params.tuitId);
      res.status(HttpStatusCode.ok).json(tuit);
    } catch (err) {
      console.log(err);
      next(err);
    }
  };
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tuit = await this.dao.create({
        ...req.body,
        uid: req.params.userId,
      });
      res.status(HttpStatusCode.ok).json(tuit);
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
      const updatedTuit = await this.dao.update(req.params.tuitId, req.body);
      res.status(HttpStatusCode.ok).json(updatedTuit);
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
      const deletedTuit = await this.dao.delete(req.params.tuitId);
      res.status(HttpStatusCode.ok).json(deletedTuit);
    } catch (err) {
      next(err);
    }
  };
}
