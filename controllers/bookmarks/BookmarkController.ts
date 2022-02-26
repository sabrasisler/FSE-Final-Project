import { Request, Response, NextFunction } from 'express';
import IBookmarkDao from '../../daos/bookmarks/IBookmarkDao';
import IBookmark from '../../models/bookmarks/IBookmark';
import AbsBaseController from '../AbsBaseController';
import { HttpStatusCode } from '../HttpStatusCode';
import IRoute from '../IRoute';
import { Methods } from '../Methods';
import IBookMarkController from './IBookController';

/**
 * Represents the implementation of an IBookmarkController interface for handling the bookmarks resource api. Also extends the abstract {@link AbsBaseController} class for common functionality, including setRoutes().
 */
export default class BookMarkController
  extends AbsBaseController
  implements IBookMarkController
{
  public path: string;
  protected routes: IRoute[];
  private bookmarkDao: IBookmarkDao;

  /** Constructs the bookmark controller with an injected IBookmarkDao interface implementation. Defines the endpoint paths, middleware, method types, and handler methods associated with each endpoint. These definitions are later used by the setRoutes() method to wire the app to each endpoint.
   *
   * @param {IBookmarkDao} bookmarkDao a bookmark dao implementing the BookmarkDao interface used to find resources in the database.
   */
  public constructor(bookmarkDao: IBookmarkDao) {
    super();
    this.path = '/api/v1';
    this.bookmarkDao = bookmarkDao;
    this.routes = [
      {
        path: '/users/:userId/tuits/:tuitId/bookmarks',
        method: Methods.POST,
        handler: this.create,
        localMiddleware: [],
      },
      {
        path: '/users/:userId/bookmarks',
        method: Methods.GET,
        handler: this.findAllByUser,
        localMiddleware: [],
      },
      {
        path: '/bookmarks/:bookmarkId',
        method: Methods.DELETE,
        handler: this.delete,
        localMiddleware: [],
      },
    ];
  }

  /**
   * Processes request to create a bookmark. Sends userId to bookmark dao, and returns the new bookmark back to the user. The bookmark should contain the full tuit.
   * @param {Request} req the express request with user id
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any
   */
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const newBookmark: IBookmark = await this.bookmarkDao.create(
        req.params.userId,
        req.params.tuitId
      );
      res.status(HttpStatusCode.ok).json(newBookmark);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Takes a user id from request and calls bookmark dao to find all bookmarks (with tuits) the user has, which is sent back to the client.
   * @param {Request} req the express request with user id
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any
   */
  findAllByUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const bookmarks: IBookmark[] = await this.bookmarkDao.findAllByUser(
        req.params.userId
      );
      res.status(HttpStatusCode.ok).json(bookmarks);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Takes a bookmark id from the request, call the dao to delete the bookmark, and sends back the deleted bookmark to the client.
   * @param {Request} req the express request with user id
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any
   */
  delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const deletedBookmark: IBookmark = await this.bookmarkDao.delete(
        req.params.bookmarkId
      );
      res.status(HttpStatusCode.ok).json(deletedBookmark);
    } catch (err) {
      next(err);
    }
  };
}
