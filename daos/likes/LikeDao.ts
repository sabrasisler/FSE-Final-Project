import IDao from '../shared/IDao';
import { Model } from 'mongoose';
import ILikeDao from './ILikeDao';
import ILike from '../../models/likes/ILike';
import IUser from '../../models/users/IUser';
import ITuit from '../../models/tuits/ITuit';
import IErrorHandler from '../../errors/IErrorHandler';
import { LikeDaoErrors } from './LikeDaoErrors';
import Tuit from '../../models/tuits/Tuit';
import DaoDatabaseException from '../../errors/DaoDatabseException';

/**
 * Handles database CRUD operations for the likes resource. Implements {@link ILikeDao} and works with the mongoose {@link LikeModel} to access the database.
 */
export class LikeDao implements ILikeDao {
  private readonly likeModel: Model<ILike>;
  private readonly dislikeModel: Model<ILike>;
  private readonly tuitModel: Model<ITuit>;
  private readonly errorHandler: IErrorHandler;

  /**
   * Builds the DAO with the injected dependencies of a mongoose like model ({@link LikeModel}) and an error handler.
   * @param {LikeModel} likeModel the like model for the database operations
   * @param {IErrorHandler} errorHandler the error handler to process all errors
   */
  public constructor(
    likeModel: Model<ILike>,
    dislikeModel: Model<ILike>,
    tuitModel: Model<ITuit>,
    errorHandler: IErrorHandler
  ) {
    this.likeModel = likeModel;
    this.dislikeModel = dislikeModel;
    this.tuitModel = tuitModel;
    this.errorHandler = errorHandler;
    Object.freeze(this); // Make this object immutable.
  }

  createLike = async (userId: string, tuitId: string): Promise<ITuit> => {
    try {
      await this.likeModel.create({
        user: userId,
        tuit: tuitId,
      });
      const updatedTuit = await this.tuitModel
        .findOneAndUpdate(
          { _id: tuitId },
          { $inc: { 'stats.likes': 1 }, $addToSet: { likedBy: [userId] } },
          { new: true }
        )
        .populate('author');
      return this.errorHandler.objectOrNullException(
        updatedTuit,
        'Failed to update tuit stats after creating like'
      );
    } catch (err) {
      throw new DaoDatabaseException('Failed to create like.', err);
    }
  };

  createDislike = async (userId: string, tuitId: string): Promise<ITuit> => {
    try {
      await this.dislikeModel.create({
        user: userId,
        tuit: tuitId,
      });
      const updatedTuit = await this.tuitModel
        .findOneAndUpdate(
          { _id: tuitId },
          {
            $inc: { 'stats.dislikes': 1 },
            $addToSet: { dislikedBy: [userId] },
          },
          { new: true }
        )
        .populate('author');
      return this.errorHandler.objectOrNullException(
        updatedTuit,
        'Failed to update tuit stats after creating dislike'
      );
    } catch (err) {
      throw new DaoDatabaseException('Failed to create dislike.', err);
    }
  };

  findLike = async (userId: string, tuitId: string): Promise<ILike | null> => {
    try {
      return await this.likeModel.findOne({ user: userId, tuit: tuitId });
    } catch (err) {
      throw new DaoDatabaseException('Failed to find like.', err);
    }
  };

  findDislike = async (
    userId: string,
    tuitId: string
  ): Promise<ILike | null> => {
    try {
      return await this.dislikeModel.findOne({ user: userId, tuit: tuitId });
    } catch (err) {
      throw new DaoDatabaseException('Failed to find dislike.', err);
    }
  };

  deleteLike = async (userId: string, tuitId: string): Promise<ITuit> => {
    try {
      const deletedLike = await this.likeModel.deleteOne(
        { user: userId, tuit: tuitId },
        { new: true }
      );
      const updatedTuit = await this.tuitModel
        .findOneAndUpdate(
          { _id: tuitId, 'stats.likes': { $gt: 0 } },
          {
            $inc: { 'stats.likes': -1 },
            $pull: { likedBy: { $in: [userId] } },
          },
          { new: true }
        )
        .populate('author');
      return this.errorHandler.objectOrNullException(
        updatedTuit,
        'Error updating tuit after deleting like: Tuit not found.'
      );
    } catch (err) {
      throw new DaoDatabaseException('Failed to delete like.', err);
    }
  };

  deleteDislike = async (userId: string, tuitId: string): Promise<ITuit> => {
    try {
      const deletedDislike = await this.dislikeModel.deleteOne(
        { user: userId, tuit: tuitId },
        { new: true }
      );
      const updatedTuit = await this.tuitModel
        .findOneAndUpdate(
          { _id: tuitId, 'stats.dislikes': { $gt: 0 } },
          {
            $inc: { 'stats.dislikes': -1 },
            $pull: { dislikedBy: { $in: [userId] } },
          },
          { new: true }
        )
        .populate('author');
      return this.errorHandler.objectOrNullException(
        updatedTuit,
        'Error updating tuit after deleting dislike: Tuit not found.'
      );
    } catch (err) {
      throw new DaoDatabaseException('Failed to delete dislike.', err);
    }
  };

  /**
   * Finds all users who liked a particular tuit using the tuit id.
   * @param {string} tuitId the id of the tuit
   * @returns an array of {@link IUser} documents who have liked the tuit
   */
  findAllUsersByTuitLike = async (tuitId: string): Promise<IUser[]> => {
    try {
      // Get the likes.
      const likes: ILike[] = await this.likeModel
        .find({ tuit: tuitId })
        .populate('user')
        .exec();
      // Now that we have all the likes, let's extract just the users.
      const users: IUser[] = [];
      likes.map((like) => {
        users.push(like.user);
      });
      return this.errorHandler.objectOrNullException(
        users,
        LikeDaoErrors.NO_USERS_FOUND_FOR_LIKE
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        LikeDaoErrors.DB_ERROR_USERS_BY_LIKE,
        err
      );
    }
  };

  /**
   * Finds all tuits that a user liked by calling the likeModel. Also Populates the liked tuit.
   * @param {string} userId the id of the user
   * @returns an array of {@link ILike} documents with populated {@link ITuit} tuits
   */
  findAllTuitsLikedByUser = async (userId: string): Promise<ITuit[]> => {
    try {
      const likes: ILike[] = await this.likeModel
        .find({ user: userId })
        .populate({ path: 'tuit' })
        .exec();
      const tuits: ITuit[] = [];
      likes.map((like) => {
        tuits.push(like.tuit);
      });
      return this.errorHandler.objectOrNullException(
        tuits,
        LikeDaoErrors.NO_TUITS_FOUND_FOR_LIKE
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        LikeDaoErrors.DB_ERROR_TUITS_BY_LIKE,
        err
      );
    }
  };
  findAllTuitsDislikedByUser = async (userId: string): Promise<ITuit[]> => {
    try {
      const likes: ILike[] = await this.dislikeModel
        .find({ user: userId })
        .populate({ path: 'tuit' })
        .exec();
      const tuits: ITuit[] = [];
      likes.map((like) => {
        tuits.push(like.tuit);
      });
      return this.errorHandler.objectOrNullException(
        tuits,
        LikeDaoErrors.NO_TUITS_FOUND_FOR_LIKE
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        LikeDaoErrors.DB_ERROR_TUITS_BY_LIKE,
        err
      );
    }
  };
}
