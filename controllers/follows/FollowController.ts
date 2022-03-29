import IFollowDao from '../../daos/follows/IFollowDao';
import IFollow from '../../models/follows/IFollow';
import IUser from '../../models/users/IUser';
import { okResponse } from '../shared/createResponse';
import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import { Express, Router } from 'express';
import { Methods } from '../shared/Methods';
import IFollowController from './IFollowController';
import { adaptRequest } from '../shared/adaptRequest';

/**
 *  Controller that implements the path, routes, and methods for managing the  for the follows resource. Implements {@link IFollowController}. Takes {@link IFollow} DAO as dependency.
 */
export default class FollowController implements IFollowController {
  private readonly followDao: IFollowDao;

  /**
   * Constructs the controller with a follow DAO, and defines the endpoint path and routes.
   * @param {IFollowDao} followDao an implementation of a follow DAO
   */
  public constructor(path: string, app: Express, followDao: IFollowDao) {
    this.followDao = followDao;
    const router = Router();
    router.post('/:userId/follows', adaptRequest(this.createFollow));
    router.get('/:userId/followers', adaptRequest(this.findAllFollowers));
    router.get('/:userId/followees', adaptRequest(this.findAllFollowees));
    router.get(
      '/:userId/follows/pending',
      adaptRequest(this.findAllPendingFollows)
    );
    router.get('/:userId/follows', adaptRequest(this.acceptFollow));
    router.delete('/:userId/follows', adaptRequest(this.deleteFollow));
    app.use(path, router);
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
    return okResponse(newFollow);
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
  findAllFollowees = async (req: HttpRequest): Promise<HttpResponse> => {
    const allFollowees: IUser[] = await this.followDao.findAllFollowees(
      req.params.userId
    );
    return okResponse(allFollowees);
  };

  /**
   * Calls the follow dao in state to find all users that are following a particular user using the that user's id.
   * @param {HttpRequest} req the request object containing client data
   * @returns {HttpResponse} a response object with the all the users
   */
  findAllFollowers = async (req: HttpRequest): Promise<HttpResponse> => {
    const allFollowers: IUser[] = await this.followDao.findAllFollowers(
      req.params.userId
    );
    return okResponse(allFollowers);
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
    return okResponse(updatedAcceptedFollow);
  };
}
