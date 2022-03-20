import IBookmarkDao from '../../daos/bookmarks/IBookmarkDao';
import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import IBookMarkController from './IBookmarkController';
import { Express, Router } from 'express';
import { adaptRequest } from '../shared/adaptRequest';

/**
 * Represents the implementation of an IBookmarkController interface for handling the bookmarks resource api.
 */
export default class BookMarkController implements IBookMarkController {
  private bookmarkDao: IBookmarkDao;

  /** Constructs the bookmark controller with an injected IBookmarkDao interface implementation. Defines the endpoint paths, middleware, method types, and handler methods associated with each endpoint. These definitions are later used by the setRoutes() method to wire the app to each endpoint.
   *
   * @param {IBookmarkDao} bookmarkDao a bookmark dao implementing the BookmarkDao interface used to find resources in the database.
   */
  public constructor(path: string, app: Express, bookmarkDao: IBookmarkDao) {
    this.bookmarkDao = bookmarkDao;
    const router = Router();
    router.post('/:userId/tuits/:tuitId/bookmarks', adaptRequest(this.create));
    router.get('/:userId/bookmarks', adaptRequest(this.findAllByUser));
    router.delete('/:userId/bookmarks/:bookmarkId', adaptRequest(this.delete));
    router.delete('/:userId/bookmarks/', adaptRequest(this.deleteAllByUser));
    app.use(path, router);
    Object.freeze(this); // Make thi obj immutable.
  }

  /**
   * Processes request to create a bookmark. Sends userId to bookmark dao, and returns the new bookmark back to the user. The bookmark should contain the full tuit.
   * @param {Request} req the express request with user id
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any
   */
  create = async (req: HttpRequest): Promise<HttpResponse> => {
    return {
      body: await this.bookmarkDao.create(req.params.userId, req.params.tuitId),
    };
  };

  /**
   * Takes a user id from request and calls bookmark dao to find all bookmarks (with tuits) the user has, which is sent back to the client.
   * @param {Request} req the express request with user id
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any
   */
  findAllByUser = async (req: HttpRequest): Promise<HttpResponse> => {
    return { body: await this.bookmarkDao.findAllByUser(req.params.userId) };
  };

  /**
   * Takes a bookmark id from the request, call the dao to delete the bookmark, and sends back the deleted bookmark to the client.
   * @param {Request} req the express request with user id
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any
   */
  delete = async (req: HttpRequest): Promise<HttpResponse> => {
    return { body: await this.bookmarkDao.delete(req.params.bookmarkId) };
  };

  deleteAllByUser = async (req: HttpRequest): Promise<HttpResponse> => {
    const deletedCount: number = await this.bookmarkDao.deleteAllByUser(
      req.params.userId
    );
    return { body: deletedCount };
  };
}
