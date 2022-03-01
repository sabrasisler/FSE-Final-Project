import { Model, Query } from 'mongoose';
import { FollowDaoErrors } from './FollowDaoErrors';
import IErrorHandler from '../../errors/IErrorHandler';
import IFollow from '../../models/follows/IFollow';
import IUser from '../../models/users/IUser';
import IFollowDao from './IFollowDao';

/**
 * Database operations for the follows resource. Takes a mongoose follow model and error handler as a dependency.
 */
export default class FollowDao implements IFollowDao {
  private readonly errorHandler: IErrorHandler;
  private readonly followModel: Model<IFollow>;

  /**
   * Constructs the DAO with a follow model and error handler.
   * @param {Model<IFollow>} followModel the mongoose bookmark model
   * @param {IErrorHandler} errorHandler the error handler for all errors
   */
  public constructor(followModel: Model<IFollow>, errorHandler: IErrorHandler) {
    this.followModel = followModel;
    this.errorHandler = errorHandler;
    Object.freeze(this);
  }

  /**
   * Creates a follow document with the provided follower and followee ids.
   * @param {string} follower
   * @param {string} followee
   * @returns {Promise<IFollow>} the new follow promise document
   */
  userFollowsUser = async (
    follower: string,
    followee: string
  ): Promise<IFollow> => {
    try {
      return await this.followModel.create({
        follower: follower,
        followee: followee,
      });
    } catch (err) {
      throw this.errorHandler.handleError(
        FollowDaoErrors.DB_ERROR_USER_FOLLOWS_USER,
        err
      );
    }
  };

  /**
   * Deletes a follow document with the provided follower and followee ids.
   * @param {string} follower
   * @param {string} followee
   * @returns {Promise<IFollow>} the deleted follow promise document
   */
  userUnfollowsUser = async (
    follower: string,
    followee: string
  ): Promise<IFollow> => {
    try {
      const deletedFollow = await this.followModel.findOneAndDelete({
        follower: follower,
        followee: followee,
      });
      return this.errorHandler.handleNull(
        deletedFollow,
        FollowDaoErrors.NO_FOLLOW_FOUND_TO_DELETE
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        FollowDaoErrors.DB_ERROR_USER_UNFOLLOWS_USER,
        err
      );
    }
  };

  /**
   * Find all users who the specified user (by id) is following. First get the matching follow documents and then only target the users from the follow documents.
   * @param {string} userId the id of the user who is following all the users to be  returned
   * @returns {Promise<IUser[]>} a promise with all users the specified user is following
   */
  findAllUsersThatUserIsFollowing = async (
    userId: string
  ): Promise<IUser[]> => {
    try {
      const follows: IFollow[] = await this.followModel
        .find({ follower: userId })
        .populate('followee');
      const justTheUsers = follows.map((follow) => follow.followee);
      return justTheUsers;
    } catch (err) {
      throw this.errorHandler.handleError(
        FollowDaoErrors.DB_ERROR_FINDING_FOLLOWERS_OF_USER,
        err
      );
    }
  };

  /**
   * Find all users who are following the specified user (by id). First get the matching follow documents and then only target the users from the follow documents.
   * @param {string} userId the id of the user
   * @returns {Promise<IUser[]>} a promise with all users following the specified user
   */
  findAllUsersFollowingUser = async (userId: string): Promise<IUser[]> => {
    try {
      const follows: IFollow[] = await this.followModel
        .find({ followee: userId })
        .populate('follower');
      const justTheUsers = follows.map((follow) => follow.follower);
      return justTheUsers;
    } catch (err) {
      throw this.errorHandler.handleError(
        FollowDaoErrors.DB_ERROR_FINDING_FOLLOWERS_OF_USER,
        err
      );
    }
  };

  /**
   * Update a follow document by changing the accepted field to true using the id of the user who is being followed and the id of the follow document.
   * @param {string} userId the id of the user being followed who is accepting the follow request
   * @param {string} followId the id of the follow document
   * @returns {Promise<IFollow>} the updated follow document
   */
  acceptFollow = async (userId: string, followId: string): Promise<IFollow> => {
    try {
      const updatedFollow = await this.followModel.findOneAndUpdate(
        {
          _id: followId,
          followee: userId,
        },
        { accepted: true },
        { new: true }
      );

      return this.errorHandler.handleNull(
        updatedFollow,
        FollowDaoErrors.NO_FOLLOW_FOUND
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        FollowDaoErrors.DB_ERROR_ACCEPT_FOLLOW,
        err
      );
    }
  };

  /**
   * Find all the follow documents that have not yet been accepted by the the user being followed.
   * @param {string} userId the id of the followee
   * @returns {Promise<IFollow[]>} an array of all the follow requests not accepted
   */
  findAllPendingFollows = async (userId: string): Promise<IFollow[]> => {
    try {
      const pendingFollows = await this.followModel.find({
        followee: userId,
      });
      return this.errorHandler.handleNull(
        pendingFollows,
        FollowDaoErrors.NO_FOLLOW_FOUND
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        FollowDaoErrors.DB_ERROR_PENDING_FOLLOWS,
        err
      );
    }
  };
}
