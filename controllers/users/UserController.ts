import { NextFunction, Request, Response } from 'express';
import IController from '../IController';
import IDao from '../../daos/IDao';
import IUser from '../../models/users/IUser';
import { HttpStatusCode } from '../HttpStatusCode';
import AbsBaseController from '../AbsBaseController';
import IRoute from '../IRoute';
import { Methods } from '../Methods';

/**
 * Processes the requests and responses dealing with the user resource. Extends {@link AbsBaseController} and implements {@link IController}.
 */
export class UserController extends AbsBaseController implements IController {
  public path: string;
  protected routes: IRoute[];
  private readonly dao: IDao<IUser>;

  /**
   * Constructs the user controller by calling the super abstract, setting the dao, and configuring the endpoint paths. The endpoint paths are set dynamically when the abstract method setRoutes() is called.
   * @param dao a user dao that implements {@link IDao}
   */
  public constructor(dao: IDao<IUser>) {
    super();
    this.path = '/api/v1';
    this.dao = dao;
    this.routes = [
      {
        path: '/users',
        method: Methods.GET,
        handler: this.findAll,
        localMiddleware: [],
      },
      {
        path: '/users/:userId',
        method: Methods.GET,
        handler: this.findById,
        localMiddleware: [],
      },
      {
        path: '/users/:userId',
        method: Methods.POST,
        handler: this.create,
        localMiddleware: [],
      },
      {
        path: '/users/:userId',
        method: Methods.PUT,
        handler: this.update,
        localMiddleware: [],
      },
      {
        path: '/users/:userId',
        method: Methods.DELETE,
        handler: this.delete,
        localMiddleware: [],
      },
    ];
    Object.freeze(this); // Make this object immutable.
  }

  /**
   * Calls the dao to find all users and returns them in the response. Passes errors to the next middleware.
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
      const allUsers: IUser[] | null = await this.dao.findAll();
      res.status(200).json(allUsers);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Takes the user id from the request params and calls the dao to find the user. Sends the user back to the client, or passes any errors to the next middleware.
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
      const existingUser: IUser = await this.dao.findById(req.params.userId);
      res.status(HttpStatusCode.ok).json(existingUser);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Takes the details of a user from the client request and calls the dao to create a new user object using the request body. Sends back the new user, or passes any errors to the next function middleware.
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
    const data = { ...req.body, uid: req.params.userId };
    try {
      const newUser: IUser = await this.dao.create(data);
      res.status(HttpStatusCode.ok).json(newUser);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Processes updating a user by calling the dao with the user id and update body from the request object. Sends the updated user object back to the client, or passes any errors to the next function middleware.
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
      const updatedUser = await this.dao.update(req.params.userId, req.body);
      res.status(HttpStatusCode.ok).json(updatedUser);
    } catch (err) {
      next(err);
    }
  };

  /**
   * Takes the user id from the request param and calls the dao to delete the user by id. Sends back the deleted user to the client once it is deleted and returned from the dao. Sends any errors to the next function middleware.
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
      const deletedUser = await this.dao.delete(req.params.userId);
      res.status(HttpStatusCode.ok).json(deletedUser);
    } catch (err) {
      next(err);
    }
  };
}
