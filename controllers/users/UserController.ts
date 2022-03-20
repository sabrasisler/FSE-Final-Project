import IGenericController from '../shared/IGenericController';
import IDao from '../../daos/shared/IDao';
import IUser from '../../models/users/IUser';
import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import User from '../../models/users/User';
import { createOkResponse } from '../shared/createResponse';
import { Express, Router } from 'express';
import { adaptRequest } from '../shared/adaptRequest';
import { isAuthenticated } from '../auth/isAuthenticated';
import {
  validatePassword,
  validateProfile,
  validationResults,
} from '../middleware/validateProfile';
import { body, validationResult } from 'express-validator';

/**
 * Processes the requests and responses dealing with the user resource. Implements {@link IController}.
 */
export class UserController {
  private readonly dao: IDao<IUser>;

  /**
   * Constructs the user controller by calling the super abstract, setting the dao, and configuring the endpoint paths.
   * @param dao a user dao that implements {@link IDao}
   */

  public constructor(path: string, app: Express, dao: IDao<IUser>) {
    this.dao = dao;
    const router = Router();
    router.get('/', adaptRequest(this.findAll));
    router.post('/', adaptRequest(this.create));
    router.get('/:userId', adaptRequest(this.findById));
    router.put(
      '/:userId',
      isAuthenticated,
      validateProfile,
      validationResults,
      adaptRequest(this.update)
    );
    router.delete('/:userId', adaptRequest(this.delete));
    app.use(path, router);
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
    const updatedUser = await this.dao.update(req.params.userId, req.body);
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
