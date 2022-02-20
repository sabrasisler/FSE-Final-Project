import { Request, Response, NextFunction } from 'express';
import ILikeDao from '../../daos/likes/ILikeDao';
import ILike from '../../models/likes/ILike';
import ITuit from '../../models/tuits/ITuit';
import IUser from '../../models/users/IUser';
import { HttpStatusCode } from '../HttpStatusCode';
import ILikeController from './ILikeController';

export default class LikeController implements ILikeController {
  private readonly dao: ILikeDao;

  constructor(dao: ILikeDao) {
    this.dao = dao;
  }
  userLikesTuit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const likedTuit: ITuit = await this.dao.userLikesTuit(
      req.params.uid,
      req.params.tid
    );
    res.status(HttpStatusCode.ok).json(likedTuit);
  };
  userUnlikesTuit = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const unlikedTuit: ITuit | null = await this.dao.userUnlikesTuit(
      req.params.uid,
      req.params.tid
    );
    res.status(HttpStatusCode.ok).json(unlikedTuit);
  };
  findAllUsersByTuitLike = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const users: IUser[] = await this.dao.findAllUsersByTuitLike(
      req.params.tid
    );
    res.status(HttpStatusCode.ok).json(users);
  };
  findAllTuitsLikedByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const tuits: ITuit[] = await this.dao.findAllTuitsLikedByUser(
      req.params.uid
    );
    res.status(HttpStatusCode.ok).json(tuits);
  };
}
