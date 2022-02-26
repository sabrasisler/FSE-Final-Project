import { Request, Response, NextFunction } from 'express';

/**
 *
 * Interface representing a CRUD controller for the likes resource api. Defines the controller operations of a like, including user likes/dislikes tuit, finding all useres that liked a tuit, and finding all tuits liked by a user.
 * @class ILikeController
 */
export default interface ILikeController {
  userLikesTuit(req: Request, res: Response, next: NextFunction): Promise<void>;

  /**
   * Processes the request and response of a user unliking a tuit.
   * @param {Request} req the express request of a user unliking a tuit
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any additional processing
   * @returns Promise<void>
   */
  userUnlikesTuit(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  /**
   * Processes the request and response of finding all users that liked a tuit.
   * @param {Request} req the express request coming from the client
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any additional processing
   * @returns Promise<void>
   */
  findAllUsersByTuitLike(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  /**
   * Processes the request of getting all tuits liked by a user.
   * @param {Request} req the express request of a user liking a tuit
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any additional processing
   * @returns Promise<void>
   */
  findAllTuitsLikedByUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
