import IDao from '../shared/IDao';
import { Model } from 'mongoose';
import ILikeDao from './ILikeDao';
import ILike from '../../models/likes/ILike';
import IUser from '../../models/users/IUser';
import ITuit from '../../models/tuits/ITuit';
import IErrorHandler from '../../errors/IErrorHandler';
import { LikeDaoErrors } from './LikeDaoErrors';

/**
 * Handles database CRUD operations for the likes resource. Implements {@link ILikeDao} and works with the mongoose {@link LikeModel} to access the database.
 */
export class LikeDao implements ILikeDao {
  private readonly likeModel: Model<ILike>;
  private readonly errorHandler: IErrorHandler;

  /**
   * Builds the DAO with the injected dependencies of a mongoose like model ({@link LikeModel}) and an error handler.
   * @param {LikeModel} likeModel the like model for the database operations
   * @param {IErrorHandler} errorHandler the error handler to process all errors
   */
  public constructor(likeModel: Model<ILike>, errorHandler: IErrorHandler) {
    this.likeModel = likeModel;
    this.errorHandler = errorHandler;
    Object.freeze(this); // Make this object immutable.
  }

  /**
   * Creates a like document when a user likes a tuit. Also populates the liked tuit.
   * @param userId the id of the user
   * @param tuitId the id of the tuit
   * @returns the new like document, retrieved from the LikeModel
   */
  userLikesTuit = async (userId: string, tuitId: string): Promise<ILike> => {
    try {
      const like: ILike | null = await (
        await this.likeModel.create({ user: userId, tuit: tuitId })
      ).populate('tuit');
      return this.errorHandler.objectOrNullException(
        like,
        LikeDaoErrors.LIKE_NOT_FOUND
      );
    } catch (err) {
      console.log('ERROR: ' + err);
      throw this.errorHandler.handleError(
        LikeDaoErrors.DB_ERROR_LIKE_TUIT,
        err
      );
    }
  };

  /**
   * Deletes a like document for the specified user and tuit, and returns the deleted like with a populated tuit.
   * @param {string} userId the id of the user
   * @param {string} tuitId the id of the tuit
   * @returns the deleted like document, returned from the LikeModel after deletion occurs successfully
   */
  userUnlikesTuit = async (userId: string, tuitId: string): Promise<ILike> => {
    try {
      const likeToDelete = await this.likeModel
        .findOne({
          user: userId,
          tuit: tuitId,
        })
        .populate('tuit');
      likeToDelete?.remove();
      return this.errorHandler.objectOrNullException(
        likeToDelete,
        LikeDaoErrors.DELETED_LIKE_NOT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        LikeDaoErrors.DB_ERROR_UNLIKE_TUIT,
        err
      );
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
}
