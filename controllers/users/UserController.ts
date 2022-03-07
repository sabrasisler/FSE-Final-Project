import IGenericController from '../shared/IGenericController';
import IDao from '../../daos/IDao';
import IUser from '../../models/users/IUser';
import { Methods } from '../shared/Methods';
import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import IControllerRoute from '../shared/IControllerRoute';
import User from '../../models/users/User';
import { createOkResponse } from '../shared/createHttpResponse';

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
      },
      {
        path: '/users',
        method: Methods.POST,
        handler: this.create,
      },
      {
        path: '/users/:userId',
        method: Methods.GET,
        handler: this.findById,
      },

      {
        path: '/users/:userId',
        method: Methods.PUT,
        handler: this.update,
      },
      {
        path: '/users/:userId',
        method: Methods.DELETE,
        handler: this.delete,
      },
    ];
    Object.freeze(this); // Make this object immutable.
  }

  /**
   * Calls the dao to find all users and returns them in the response. Passes errors to the next middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findAll = async (): Promise<HttpResponse> => {
    const allUsers: IUser[] = await this.dao.findAll();
    return createOkResponse(allUsers);
  };

  /**
   * Takes the user id from the request params and calls the dao to find the user. Sends the user back to the client, or passes any errors to the next middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findById = async (req: HttpRequest): Promise<HttpResponse> => {
    const dbUser: IUser = await this.dao.findById(req.params.userId);
    return createOkResponse(dbUser);
  };

  /**
   * Takes the details of a user from the client request and calls the dao to create a new user object using the request body. Sends back the new user, or passes any errors to the next function middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  create = async (req: HttpRequest): Promise<HttpResponse> => {
    const validatedUser: IUser = new User({ ...req.body });
    const dbUser = await this.dao.create(validatedUser);
    return createOkResponse(dbUser);
  };

  /**
   * Processes updating a user by calling the dao with the user id and update body from the request object. Sends the updated user object back to the client, or passes any errors to the next function middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  update = async (req: HttpRequest): Promise<HttpResponse> => {
    const validatedUser: IUser = new User({ ...req.body });
    const updatedUser = await this.dao.update(req.params.userId, validatedUser);
    return createOkResponse(updatedUser);
  };

  /**
   * Takes the user id from the request param and calls the dao to delete the user by id. Sends back the deleted user to the client once it is deleted and returned from the dao. Sends any errors to the next function middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  delete = async (req: HttpRequest): Promise<HttpResponse> => {
    const deletedUser: IUser = await this.dao.delete(req.params.userId);
    return createOkResponse(deletedUser);
  };
}
