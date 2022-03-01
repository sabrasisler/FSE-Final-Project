import IGenericController from '../IGenericController';
import IDao from '../../daos/IDao';
import IUser from '../../models/users/IUser';
import { Methods } from '../Methods';
import HttpRequest from '../HttpRequest';
import HttpResponse from '../HttpResponse';
import IControllerRoute from '../IControllerRoute';

/**
 * Processes the requests and responses dealing with the user resource. Implements {@link IController}.
 */
export class UserController implements IGenericController {
  public readonly path: string;
  public readonly routes: IControllerRoute[];
  private readonly dao: IDao<IUser>;

  /**
   * Constructs the user controller by calling the super abstract, setting the dao, and configuring the endpoint paths.
   * @param dao a user dao that implements {@link IDao}
   */
  public constructor(dao: IDao<IUser>) {
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
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findAll = async (req: HttpRequest): Promise<HttpResponse> => {
    return {
      body: await this.dao.findAll(),
    };
  };

  /**
   * Takes the user id from the request params and calls the dao to find the user. Sends the user back to the client, or passes any errors to the next middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findById = async (req: HttpRequest): Promise<HttpResponse> => {
    //
    return { body: await this.dao.findById(req.params.userId) };
  };

  /**
   * Takes the details of a user from the client request and calls the dao to create a new user object using the request body. Sends back the new user, or passes any errors to the next function middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  create = async (req: HttpRequest): Promise<HttpResponse> => {
    const data = { ...req.body, uid: req.params.userId };
    return { body: await this.dao.create(data) };
  };

  /**
   * Processes updating a user by calling the dao with the user id and update body from the request object. Sends the updated user object back to the client, or passes any errors to the next function middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  update = async (req: HttpRequest): Promise<HttpResponse> => {
    return { body: await this.dao.update(req.params.userId, req.body) };
  };

  /**
   * Takes the user id from the request param and calls the dao to delete the user by id. Sends back the deleted user to the client once it is deleted and returned from the dao. Sends any errors to the next function middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  delete = async (req: HttpRequest): Promise<HttpResponse> => {
    return { body: await this.dao.delete(req.params.userId) };
  };
}
