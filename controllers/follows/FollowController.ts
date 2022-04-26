import IFollowDao from '../../daos/follows/IFollowDao';
import IFollow from '../../models/follows/IFollow';
import IUser from '../../models/users/IUser';
import { okResponse } from '../shared/createResponse';
import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import { Express, Router } from 'express';
import IFollowController from './IFollowController';
import { adaptRequest } from '../shared/adaptRequest';
import IDao from '../../daos/shared/IDao';
import NotificationDao from '../../daos/notifications/NotificationsDao';
import Notification from '../../models/notifications/INotification';
import { Server } from 'socket.io';
import { isAuthenticated } from '../auth/isAuthenticated';

/**
 *  Controller that implements the path, routes, and methods for managing the  for the follows resource. Implements {@link IFollowController}. Takes {@link IFollow} DAO as dependency.
 */
export default class FollowController implements IFollowController {
  private readonly followDao: IFollowDao;
  private readonly userDao: IDao<IUser>;
  private readonly notificationDao: NotificationDao;
  private readonly socketServer: Server;

  /**
   * Constructs the controller with a follow DAO, and defines the endpoint path and routes.
   * @param {IFollowDao} followDao an implementation of a follow DAO
   */
  public constructor(
    path: string,
    app: Express,
    followDao: IFollowDao,
    userDao: IDao<IUser>,
    notificationDao: NotificationDao,
    socketServer: Server
  ) {
    this.followDao = followDao;
    this.userDao = userDao;
    this.notificationDao = notificationDao;
    this.socketServer = socketServer;

    const router = Router();
    router.post(
      '/:userId/follows',
      isAuthenticated,
      adaptRequest(this.createFollow)
    );
    router.get(
      '/:userId/followers',
      isAuthenticated,
      adaptRequest(this.findAllFollowers)
    );
    router.get(
      '/:userId/followees',
      isAuthenticated,
      adaptRequest(this.findAllFollowees)
    );
    router.get(
      '/:userId/follows/pending',
      adaptRequest(this.findAllPendingFollows)
    );
    router.get(
      '/:userId/follows',
      isAuthenticated,
      adaptRequest(this.acceptFollow)
    );
    router.delete(
      '/:userId/follows',
      isAuthenticated,
      adaptRequest(this.deleteFollow)
    );
    app.use(path, router);
  }
  /**
   * Calls the follow dao in state to create a new follow using the follower and followee id.
   * @param {HttpRequest} req the request object containing client data
   * @returns {HttpResponse} a response object with the new follow
   */
  createFollow = async (req: HttpRequest): Promise<HttpResponse> => {
    const followerId: string = req.params.userId;
    const followeeId: string = req.body.followeeId;

    const newFollow: IFollow = await this.followDao.createFollow(
      followerId,
      followeeId
    );

    const followNotification: Notification =
      await this.notificationDao.createNotificationForUser(
        'FOLLOWS',
        followeeId,
        followerId
      );

    // When we create a new follow, update both user's follow counts
    await this.updateFollowCount(followerId, followeeId, 1);

    // Emit a new update to the Socket server when a new follow notification is created
    this.socketServer
      .to(followeeId)
      .emit('NEW_NOTIFICATION', followNotification);

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

    await this.updateFollowCount(req.params.userId, req.body.followeeId, -1);

    return {
      body: deletedFollow,
    };
  };

  /**
   * Helper function to increment or decrement the follow counts for relevant users
   *
   * @param followerId  the followerUser's id
   * @param followeeId the followeeUser's id
   * @param increment 1 | -1, the value to change the follow count by
   */
  updateFollowCount = async (
    followerId: string,
    followeeId: string,
    increment: 1 | -1
  ) => {
    const followerUser: IUser = await this.userDao.findById(followerId);
    const followeeUser: IUser = await this.userDao.findById(followeeId);

    followerUser.followerCount = (followerUser.followerCount || 0) + increment;
    followeeUser.followeeCount = (followeeUser.followeeCount || 0) + increment;

    const updatedFollower: IUser = await this.userDao.update(
      followerId,
      followerUser
    );
    const updatedFollowee: IUser = await this.userDao.update(
      followeeId,
      followeeUser
    );
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
