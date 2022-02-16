import { Request, Response, NextFunction } from 'express';
export default interface ILikeController {
  userLikesTuit(req: Request, res: Response, next: NextFunction): Promise<void>;
  userUnlikesTuit(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  findAllUsersByTuitLike(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  findAllTuitsLikedByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
