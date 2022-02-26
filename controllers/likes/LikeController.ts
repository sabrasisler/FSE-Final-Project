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

/**
 * Represents the implementation of an ILikeController interface for handling the likes resource api. Also extends the abstract {@link AbsBaseController} class for common functionality, including setRoutes().
 */

export default class LikeController
  extends AbsBaseController
  implements ILikeController
{
  public path: string;
  private readonly dao: ILikeDao;
  public readonly routes: IRoute[];

  /** Constructs the like controller with an injected ILikeDao interface implementation. Defines the endpoint paths, middleware, method types, and handler methods associated with each endpoint. These definitions are later used by the setRoutes() method to wire the app to each endpoint.
   *
   * @param {ILikeDao} likeDao a like dao implementing the ILikeDao interface used to find resources in the database.
   */
  constructor(likeDao: ILikeDao) {
    super();
    this.path = '/api/v1';
    this.dao = likeDao;
    this.routes = [
      {
        path: '/users/:userId/tuits/:tuitId/likes',
        method: Methods.POST,
        handler: this.userLikesTuit,
        localMiddleware: [],
      },
      {
        path: '/users/userId:/tuits/:tuitId/likes',
        method: Methods.DELETE,
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
    Object.freeze(this); // Make this object immutable.
  }
  /**
   * Processes the endpoint request of a user liking a tuit by calling the likeDao, which will create and return a like document. Sends the liked tuit back to the client with a success status. Passes any caught errors to the next function to be handled by the central error middleware.
   * @param {Request} req the express request object from the client
   * @param {Response} res the express response object to send a response to the client
   * @param {NextFunction} next the express next function used to pass errors to middleware
   * @returns Promise<void>
   */
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
  /**
   * Processes the update request of a user unliking a tuit. Calls the like dao to remove the the like object associated with a tuit, and returns the tuit back to the client.
   * @param {Request} req the express request object from the client
   * @param {Response} res the express response object to send a response to the client
   * @param {NextFunction} next the express next function used to pass errors to middleware
   * @returns Promise<void>
   */
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

  /**
   * Processes request to find all users who liked a tuit. Sends an array of users who liked the tuit back to the client.
   * @param {Request} req the express request object from the client
   * @param {Response} res the express response object to send a response to the client
   * @param {NextFunction} next the express next function used to pass errors to middleware
   * @returns Promise<void>
   */
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

  /**
   * Processes the request of finding all all tuits that a particular user has liked. Calls the like dao to find the tuits, and returns the tuits back to the client.
   * @param {Request} req the express request object from the client
   * @param {Response} res the express response object to send a response to the client
   * @param {NextFunction} next the express next function used to pass errors to middleware
   * @returns Promise<void>
   */
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
