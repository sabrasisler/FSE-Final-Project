import { Request, Response, NextFunction } from 'express';
import ILikeDao from '../../daos/likes/ILikeDao';
import ITuit from '../../models/tuits/ITuit';
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
  findAllUsersByTuitLike(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findAllTuitsLikedByUser(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
