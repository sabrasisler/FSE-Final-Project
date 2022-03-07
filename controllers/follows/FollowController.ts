import IFollowDao from '../../daos/follows/IFollowDao';
import IFollow from '../../models/follows/IFollow';
import IUser from '../../models/users/IUser';
import IFollowService from '../../services/shared/IFollowService';
import { createOkResponse } from '../shared/createHttpResponse';
import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import IControllerRoute from '../shared/IControllerRoute';
import { Methods } from '../shared/Methods';
import IFollowController from './IFollowController';

/**
 *  Controller that implements the path, routes, and methods for managing the  for the follows resource. Implements {@link IFollowController}. Takes {@link IFollow} DAO as dependency.
 */
export default class FollowController implements IFollowController {
  public readonly path: string;
  public readonly routes: IControllerRoute[];
  private readonly followDao: IFollowDao;

  /**
   * Constructs the controller with a follow DAO, and defines the endpoint path and routes.
   * @param {IFollowDao} followDao an implementation of a follow DAO
   */
  public constructor(followDao: IFollowDao) {
    this.path = '/api/v1';
    this.followDao = followDao;
    this.routes = [
      {
        path: '/users/:userId/follows',
        method: Methods.POST,
        handler: this.createFollow,
      },
      {
        path: '/users/:userId/follows',
        method: Methods.DELETE,
        handler: this.deleteFollow,
      },
      {
        path: '/users/:userId/followers',
        method: Methods.GET,
        handler: this.findAllUsersFollowingUser,
      },
      {
        path: '/users/:userId/following',
        method: Methods.GET,
        handler: this.findAllUsersThatUserIsFollowing,
      },
      {
        path: '/users/:userId/follows/pending',
        method: Methods.GET,
        handler: this.findAllPendingFollows,
      },
      {
        path: '/users/:userId/follows',
        method: Methods.PUT,
        handler: this.acceptFollow,
      },
    ];
  }
  /**
   * Calls the follow dao in state to create a new follow using the follower and followee id.
   * @param {HttpRequest} req the request object containing client data
   * @returns {HttpResponse} a response object with the new follow
   */
  createFollow = async (req: HttpRequest): Promise<HttpResponse> => {
    const newFollow: IFollow = await this.followDao.createFollow(
      req.params.userId,
      req.body.followeeId
    );
    return createOkResponse(newFollow);
  };

  /**
   * Calls the follow dao in state to delete a follow using the the user and follow object id.
   * @param {HttpRequest} req the request object containing client data
   * @returns {HttpResponse} a response object with the deleted follow
   */
  deleteFollow = async (req: HttpRequest): Promise<HttpResponse> => {
    const deletedFollow: IFollow = await this.followDao.deleteFollow(
      req.params.userId,
      req.body.followeeId
    );
    return {
      body: deletedFollow,
    };
  };
  findAllUsersThatUserIsFollowing = async (
    req: HttpRequest
  ): Promise<HttpResponse> => {
    const allFollowees: IUser[] =
      await this.followDao.findAllUsersThatUserIsFollowing(req.params.userId);
    return createOkResponse(allFollowees);
  };

  /**
   * Calls the follow dao in state to find all users that are following a particular user using the that user's id.
   * @param {HttpRequest} req the request object containing client data
   * @returns {HttpResponse} a response object with the all the users
   */
  findAllUsersFollowingUser = async (
    req: HttpRequest
  ): Promise<HttpResponse> => {
    const allFollowers: IUser[] =
      await this.followDao.findAllUsersFollowingUser(req.params.userId);
    return createOkResponse(allFollowers);
  };

  /**
   * Calls the follow dao in state to find all follows pending approval/accept for a user using the user id.
   * @param {HttpRequest} req the request object containing client data
   * @returns {HttpResponse} a response object with the follows pending approval
   */
  findAllPendingFollows = async (req: HttpRequest): Promise<HttpResponse> => {
    const allFollows: IFollow[] = await this.followDao.findAllPendingFollows(
      req.params.userId
    );
    return {
      body: allFollows,
    };
  };

  /**
   * Calls the follow dao in state to update a follow as accepted using the followee's and follow ids.
   * @param {HttpRequest} req the request object containing client data
   * @returns {HttpResponse} a response object with the updated follow
   */
  acceptFollow = async (req: HttpRequest): Promise<HttpResponse> => {
    const updatedAcceptedFollow: IFollow = await this.followDao.acceptFollow(
      req.body.followerId,
      req.params.userId
    );
    return createOkResponse(updatedAcceptedFollow);
  };
}
