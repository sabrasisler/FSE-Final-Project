import IFollowDao from '../../daos/follows/IFollowDao';
import IFollow from '../../models/follows/IFollow';
import IUser from '../../models/users/IUser';
import HttpRequest from '../HttpRequest';
import HttpResponse from '../HttpResponse';
import IControllerRoute from '../IControllerRoute';
import { Methods } from '../Methods';
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
        handler: this.userFollowsUser,
        localMiddleware: [],
      },
      {
        path: '/users/:userId/follows',
        method: Methods.DELETE,
        handler: this.userUnfollowsUser,
        localMiddleware: [],
      },
      {
        path: '/users/:userId/followers',
        method: Methods.GET,
        handler: this.findAllUsersFollowingUser,
        localMiddleware: [],
      },
      {
        path: '/users/:userId/following',
        method: Methods.GET,
        handler: this.findAllUsersThatUserIsFollowing,
        localMiddleware: [],
      },
      {
        path: '/users/:userId/follows/pending',
        method: Methods.GET,
        handler: this.findAllPendingFollows,
        localMiddleware: [],
      },
      {
        path: '/users/:userId/follows/:followId',
        method: Methods.PUT,
        handler: this.acceptFollow,
        localMiddleware: [],
      },
    ];
  }
  /**
   * Calls the follow dao in state to create a new follow using the follower and followee id.
   * @param {HttpRequest} req the request object containing client data
   * @returns {HttpResponse} a response object with the new follow
   */
  userFollowsUser = async (req: HttpRequest): Promise<HttpResponse> => {
    const newFollow: IFollow = await this.followDao.userFollowsUser(
      req.params.userId,
      req.body.followeeId
    );
    return {
      body: newFollow,
    };
  };

  /**
   * Calls the follow dao in state to delete a follow using the the user and follow object id.
   * @param {HttpRequest} req the request object containing client data
   * @returns {HttpResponse} a response object with the deleted follow
   */
  userUnfollowsUser = async (req: HttpRequest): Promise<HttpResponse> => {
    const deletedFollow: IFollow = await this.followDao.userUnfollowsUser(
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
    return {
      body: allFollowees,
    };
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
    return {
      body: allFollowers,
    };
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
      req.params.userId,
      req.params.followId
    );
    return {
      body: updatedAcceptedFollow,
    };
  };
}
