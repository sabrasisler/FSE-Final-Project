import { Model } from 'mongoose';
import { FollowDaoErrors } from '../../errors/FollowDaoErrors';
import IErrorHandler from '../../errors/IErrorHandler';
import IFollow from '../../models/follows/IFollow';
import IUser from '../../models/users/IUser';
import IFollowDao from './IFollowDao';

export default class FollowDao implements IFollowDao {
  private readonly errorHandler: IErrorHandler;
  private readonly followModel: Model<IFollow>;

  public constructor(followModel: Model<IFollow>, errorHandler: IErrorHandler) {
    this.followModel = followModel;
    this.errorHandler = errorHandler;
    Object.freeze(this);
  }
  userFollowsUser = async (
    follower: string,
    following: string
  ): Promise<IFollow> => {
    try {
      return await this.followModel.create({
        follower: follower,
        following: following,
      });
    } catch (err) {
      throw this.errorHandler.createError(
        FollowDaoErrors.DB_ERROR_USER_FOLLOWS_USER,
        err
      );
    }
  };
  userUnfollowsUser = async (
    follower: string,
    following: string
  ): Promise<IFollow> => {
    try {
      const deletedFollow = await this.followModel.findOneAndDelete({
        follower: follower,
        following: following,
      });
      return this.errorHandler.sameObjectOrNullException(
        deletedFollow,
        FollowDaoErrors.NO_FOLLOW_FOUND_TO_DELETE
      );
    } catch (err) {
      throw this.errorHandler.createError(
        FollowDaoErrors.DB_ERROR_USER_UNFOLLOWS_USER,
        err
      );
    }
  };
  findAllUsersThatUserIsFollowing = async (
    userId: string
  ): Promise<IUser[]> => {
    try {
      const follows: IFollow[] = await this.followModel
        .find({ follower: userId })
        .populate('following');
      const justTheUsers = follows.map((follow) => follow.following);
      return justTheUsers;
    } catch (err) {
      throw this.errorHandler.createError(
        FollowDaoErrors.DB_ERROR_FINDING_FOLLOWERS_OF_USER,
        err
      );
    }
  };
  findAllUsersFollowingUser = async (userId: string): Promise<IUser[]> => {
    try {
      const follows: IFollow[] = await this.followModel
        .find({ following: userId })
        .populate('follower');
      const justTheUsers = follows.map((follow) => follow.follower);
      return justTheUsers;
    } catch (err) {
      throw this.errorHandler.createError(
        FollowDaoErrors.DB_ERROR_FINDING_FOLLOWERS_OF_USER,
        err
      );
    }
  };
}
