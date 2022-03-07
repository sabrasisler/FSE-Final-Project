import ILikeDao from '../../daos/likes/ILikeDao';
import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import IControllerRoute from '../shared/IControllerRoute';
import { Methods } from '../shared/Methods';
import ILikeController from './ILikeController';

/**
 * Represents the implementation of an ILikeController interface for handling the likes resource api.
 */

export default class LikeController implements ILikeController {
  public readonly path: string;
  private readonly dao: ILikeDao;
  public readonly routes: IControllerRoute[];

  /** Constructs the like controller with an injected ILikeDao interface implementation. Defines the endpoint paths, middleware, method types, and handler methods associated with each endpoint.
   *
   * @param {ILikeDao} likeDao a like dao implementing the ILikeDao interface used to find resources in the database.
   */
  constructor(likeDao: ILikeDao) {
    this.path = '/api/v1';
    this.dao = likeDao;
    this.routes = [
      {
        path: '/users/:userId/tuits/:tuitId/likes',
        method: Methods.POST,
        handler: this.userLikesTuit,
      },
      {
        path: '/users/userId:/tuits/:tuitId/likes',
        method: Methods.DELETE,
        handler: this.userUnlikesTuit,
      },
      {
        path: '/tuits/:tuitId/likes',
        method: Methods.GET,
        handler: this.findAllUsersByTuitLike,
      },
      {
        path: '/users/:userId/likes',
        method: Methods.GET,
        handler: this.findAllTuitsLikedByUser,
      },
    ];
    Object.freeze(this); // Make this object immutable.
  }
  /**
   * Processes the endpoint request of a user liking a tuit by calling the likeDao, which will create and return a like document. Sends the liked tuit back to the client with a success status. Passes any caught errors to the next function to be handled by the central error middleware.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  userLikesTuit = async (req: HttpRequest): Promise<HttpResponse> => {
    return {
      body: await this.dao.userLikesTuit(req.params.userId, req.params.tuitId),
    };
  };
  /**
   * Processes the update request of a user unliking a tuit. Calls the like dao to remove the the like object associated with a tuit, and returns the tuit back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  userUnlikesTuit = async (req: HttpRequest): Promise<HttpResponse> => {
    return {
      body: await this.dao.userUnlikesTuit(
        req.params.userId,
        req.params.tuitId
      ),
    };
  };

  /**
   * Processes request to find all users who liked a tuit. Sends an array of users who liked the tuit back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findAllUsersByTuitLike = async (req: HttpRequest): Promise<HttpResponse> => {
    return { body: await this.dao.findAllUsersByTuitLike(req.params.tuitId) };
  };

  /**
   * Processes the request of finding all all tuits that a particular user has liked. Calls the like dao to find the tuits, and returns the tuits back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findAllTuitsLikedByUser = async (req: HttpRequest): Promise<HttpResponse> => {
    return { body: await this.dao.findAllTuitsLikedByUser(req.params.userId) };
  };
}
