import ITuitController from './ITuitController';
import ITuitDao from '../../daos/tuits/ITuitDao';
import { Methods } from '../Methods';
import HttpRequest from '../HttpRequest';
import HttpResponse from '../HttpResponse';
import IControllerRoute from '../IControllerRoute';

/**
 * Handles CRUD requests and responses for the Tuit resource.  Implements {@link ITuitController}.
 */
export default class TuitController implements ITuitController {
  public readonly path: string;
  public readonly routes: IControllerRoute[];
  private readonly tuitDao: ITuitDao;
  /**
   * Constructs the controller by calling the super abstract, setting the dao, and configuring the endpoint paths.
   * @param tuitDao a tuit dao that implements {@link ITuitDao}
   */
  public constructor(dao: ITuitDao) {
    this.path = '/api/v1';
    this.tuitDao = dao;
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
        path: '/users/:userId/tuit',
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
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findByUser = async (req: HttpRequest): Promise<HttpResponse> => {
    return { body: await this.tuitDao.findByUser(req.params.userId) };
  };

  /**
   * Calls the dao to find all tuits and returns them in the response. Passes errors to the next middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findAll = async (req: HttpRequest): Promise<HttpResponse> => {
    return { body: await this.tuitDao.findAll() };
  };

  /**
   * Takes the tuitId from the request params and calls the dao to find the tuit. Sends the tuit back to the client, or passes any errors to the next middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findById = async (req: HttpRequest): Promise<HttpResponse> => {
    return { body: this.tuitDao.findById(req.params.tuitId) };
  };

  /**
   * Takes the details of a tuit from the client request and calls the dao to create a new tuit object using the request body. Sends back the new tuit, or passes any errors to the next function middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  create = async (req: HttpRequest): Promise<HttpResponse> => {
    return {
      body: await this.tuitDao.create({
        ...req.body,
        author: req.params.userId,
      }),
    };
  };

  /**
   * Processes updating a tuit by calling the dao with the tuit id and update body from the request object. Sends the updated tuit object back to the client, or passes any errors to the next function middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  update = async (req: HttpRequest): Promise<HttpResponse> => {
    return { body: await this.tuitDao.update(req.params.tuitId, req.body) };
  };

  /**
   * Takes the tuit id from the request param and calls the dao to delete the tuit by id. Sends back the deleted tuit to the client once it is deleted and returned from the dao. Sends any errors to the next function middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  delete = async (req: HttpRequest): Promise<HttpResponse> => {
    return { body: await this.tuitDao.delete(req.params.tuitId) };
  };
}