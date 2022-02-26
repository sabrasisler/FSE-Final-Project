import ITuitController from './ITuitController';
import { NextFunction, Request, Response } from 'express';
import ITuitDao from '../../daos/tuits/ITuitDao';
import { HttpStatusCode } from '../HttpStatusCode';
import AbsBaseController from '../AbsBaseController';
import IRoute from '../IRoute';
import { Methods } from '../Methods';

/**
 * Handles CRUD requests and responses for the Tuit resource. Extends {@link AbsBaseController} and Implements {@link ITuitController}.
 */
export default class TuitController
  extends AbsBaseController
  implements ITuitController
{
  public path: string;
  protected routes: IRoute[];
  private readonly dao: ITuitDao;
  /**
   * Constructs the controller by calling the super abstract, setting the dao, and configuring the endpoint paths. The endpoint paths are set dynamically when the abstract method setRoutes() is called.
   * @param dao a tuit dao that implements {@link ITuitDao}
   */
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
        path: '/tuits/:tuitId',
        method: Methods.GET,
        handler: this.findById,
        localMiddleware: [],
      },
      {
        path: '/users/:userId/tuits',
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
    Object.freeze(this); // Make this object immutable.
  }

  /**
   * Uses the user id from the request parameter to call the dao to find the user. Sends the found user back to the client, or passes any caught errors to the next error handler middleware.
   * @param {Request} req the express request coming from the client
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any additional processing
   * @returns void Promise
   */
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

  /**
   * Calls the dao to find all tuits and returns them in the response. Passes errors to the next middleware.
   * @param {Request} req the express request coming from the client
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any additional processing
   * @returns void Promise
   */
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

  /**
   * Takes the tuitId from the request params and calls the dao to find the tuit. Sends the tuit back to the client, or passes any errors to the next middleware.
   * @param {Request} req the express request coming from the client
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any additional processing
   * @returns void Promise
   */
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

  /**
   * Takes the details of a tuit from the client request and calls the dao to create a new tuit object using the request body. Sends back the new tuit, or passes any errors to the next function middleware.
   * @param {Request} req the express request coming from the client
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any additional processing
   * @returns void Promise
   */
  create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tuit = await this.dao.create({
        ...req.body,
        author: req.params.userId,
      });
      res.status(HttpStatusCode.ok).json(tuit);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Processes updating a tuit by calling the dao with the tuit id and update body from the request object. Sends the updated tuit object back to the client, or passes any errors to the next function middleware.
   * @param {Request} req the express request coming from the client
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any additional processing
   * @returns void Promise
   */
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

  /**
   * Takes the tuit id from the request param and calls the dao to delete the tuit by id. Sends back the deleted tuit to the client once it is deleted and returned from the dao. Sends any errors to the next function middleware.
   * @param {Request} req the express request coming from the client
   * @param {Response} res the express response sent to the client
   * @param {NextFunction} next the next middleware function for any additional processing
   * @returns void Promise
   */
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
