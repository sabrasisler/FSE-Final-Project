import { Request, Response, NextFunction } from 'express';
import ILikeDao from '../../daos/likes/ILikeDao';
import ILike from '../../models/likes/ILike';
import ITuit from '../../models/tuits/ITuit';
import IUser from '../../models/users/IUser';
import AbsBaseController from '../AbsBaseController';
import { HttpStatusCode } from '../HttpStatusCode';
import IRoute from '../IRoute';
import { Methods } from '../Methods';
import ILikeController from './ILikeController';

export default class LikeController
  extends AbsBaseController
  implements ILikeController
{
  public path: string;
  private readonly dao: ILikeDao;
  public readonly routes: IRoute[];

  constructor(dao: ILikeDao) {
    super();
    this.path = '/api/v1';
    this.dao = dao;
    this.routes = [
      {
        path: '/users/userId:/tuits/:tuitId/likes',
        method: Methods.POST,
        handler: this.userLikesTuit,
        localMiddleware: [],
      },
      {
        path: '/users/userId:/tuits/:tuitId/likes',
        method: Methods.PUT,
        handler: this.userUnlikesTuit,
        localMiddleware: [],
      },
      {
        path: '/tuits/:tuitId/likes',
        method: Methods.GET,
        handler: this.findAllUsersByTuitLike,
        localMiddleware: [],
      },
      {
        path: '/users/:userId/likes',
        method: Methods.GET,
        handler: this.findAllTuitsLikedByUser,
        localMiddleware: [],
      },
    ];
  }
  userLikesTuit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const like: ILike = await this.dao.userLikesTuit(
        req.params.userId,
        req.params.tuitId
      );
      res.status(HttpStatusCode.ok).json(like.tuit);
    } catch (err) {
      next(err);
    }
  };
  userUnlikesTuit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const removedLike: ILike | null = await this.dao.userUnlikesTuit(
        req.params.userId,
        req.params.tuitId
      );
      res.status(HttpStatusCode.ok).json(removedLike.tuit);
    } catch (err) {
      next(err);
    }
  };
  findAllUsersByTuitLike = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users: IUser[] = await this.dao.findAllUsersByTuitLike(
        req.params.tuitId
      );
      res.status(HttpStatusCode.ok).json(users);
    } catch (err) {
      next(err);
    }
  };
  findAllTuitsLikedByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tuits: ITuit[] = await this.dao.findAllTuitsLikedByUser(
        req.params.userId
      );
      res.status(HttpStatusCode.ok).json(tuits);
    } catch (err) {
      next(err);
    }
  };
}
